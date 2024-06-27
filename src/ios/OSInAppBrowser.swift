import OSInAppBrowserLib
import UIKit

typealias OSInAppBrowserEngine = OSIABEngine<OSIABApplicationRouterAdapter, OSIABSafariViewControllerRouterAdapter, OSIABWebViewRouterAdapter>

/// The plugin's main class
@objc(OSInAppBrowser)
class OSInAppBrowser: CDVPlugin {
    /// The native library's main class
    private var plugin: OSInAppBrowserEngine?
    private var openedViewController: UIViewController?
    
    override func pluginInitialize() {
        self.plugin = .init()
    }
    
    @objc(openInExternalBrowser:)
    func openInExternalBrowser(command: CDVInvokedUrlCommand) {
        let target = OSInAppBrowserTarget.externalBrowser
        
        self.commandDelegate.run { [weak self] in
            guard let self else { return }
            
            guard
                let argumentsModel: OSInAppBrowserInputArgumentsSimpleModel = self.createModel(for: command.argument(at: 0)),
                let url = URL(string: argumentsModel.url)
            else {
                return self.send(error: .inputArgumentsIssue(target: target), for: command.callbackId)
            }
            
            delegateExternalBrowser(url, command.callbackId)
        }
    }
    
    @objc(openInSystemBrowser:)
    func openInSystemBrowser(command: CDVInvokedUrlCommand) {
        let target = OSInAppBrowserTarget.systemBrowser
        
        func delegateSystemBrowser(_ url: URL, _ options: OSIABSystemBrowserOptions) {
            DispatchQueue.main.async {
                self.plugin?.openSystemBrowser(url, options, { [weak self] event, viewControllerToOpen in
                    self?.handleResult(event, for: command.callbackId, checking: viewControllerToOpen, error: .failedToOpen(url: url.absoluteString, onTarget: target))
                })
            }
        }
        
        self.commandDelegate.run { [weak self] in
            guard let self else { return }
            
            guard
                let argumentsModel: OSInAppBrowserInputArgumentsComplexModel = self.createModel(for: command.argument(at: 0)),
                let url = URL(string: argumentsModel.url)
            else {
                return self.send(error: .inputArgumentsIssue(target: target), for: command.callbackId)
            }
                        
            delegateSystemBrowser(url, argumentsModel.toSystemBrowserOptions())
        }
    }
    
    @objc(openInWebView:)
    func openInWebView(command: CDVInvokedUrlCommand) {
        let target = OSInAppBrowserTarget.webView
        
        func delegateWebView(_ url: URL, _ options: OSIABWebViewOptions) {
            DispatchQueue.main.async {
                self.plugin?.openWebView(
                    url,
                    options,
                    onDelegateClose: { [weak self] in
                        self?.viewController.dismiss(animated: true)
                    },
                    onDelegateURL: { [weak self] url in
                        self?.delegateExternalBrowser(url, command.callbackId)
                    },
                    onDelegateAlertController: { [weak self] alert in
                        self?.viewController.presentedViewController?.show(alert, sender: nil)
                    }, { [weak self] event, viewControllerToOpen in
                        self?.handleResult(event, for: command.callbackId, checking: viewControllerToOpen, error: .failedToOpen(url: url.absoluteString, onTarget: target))
                    }
                )
            }
        }
        
        self.commandDelegate.run { [weak self] in
            guard let self else { return }
            
            guard
                let argumentsModel: OSInAppBrowserInputArgumentsComplexModel = self.createModel(for: command.argument(at: 0)),
                let url = URL(string: argumentsModel.url)
            else {
                return self.send(error: .inputArgumentsIssue(target: target), for: command.callbackId)
            }
            
            let customUserAgent = self.commandDelegate.settings["overrideuseragent"] as? String
            delegateWebView(url, argumentsModel.toWebViewOptions(with: customUserAgent))
        }
    }
    
    @objc(close:)
    func close(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run { [weak self] in
            guard let self else { return }
            
            if let openedViewController {
                DispatchQueue.main.async {
                    openedViewController.dismiss(animated: true) { [weak self] in
                        self?.sendSuccess(for: command.callbackId)
                    }
                }
            } else {
                self.send(error: .noBrowserToClose, for: command.callbackId)
            }
        }
    }
}

private extension OSInAppBrowser {
    func delegateExternalBrowser(_ url: URL, _ callbackId: String) {
        DispatchQueue.main.async {
            self.plugin?.openExternalBrowser(url, { [weak self] success in
                guard let self else { return }
                
                if success {
                    self.sendSuccess(for: callbackId)
                } else {
                    self.send(error: .failedToOpen(url: url.absoluteString, onTarget: .externalBrowser), for: callbackId)
                }
            })
        }
    }
    
    func handleResult(_ event: OSIABEventType, for callbackId: String, checking viewController: UIViewController?, error: OSInAppBrowserError) {
        let sendEvent: () -> Void = { self.sendSuccess(event, for: callbackId) }
        
        switch event {
        case .success:
            if let viewController {
                self.present(viewController) { [weak self] in
                    self?.openedViewController = viewController
                    sendEvent()
                }
            } else {
                self.send(error: error, for: callbackId)
            }
        case .pageClosed:
            self.openedViewController = nil
            fallthrough
        case .pageLoadCompleted:
            sendEvent()
        }
    }
}

private extension OSInAppBrowser {
    func createModel<T: Decodable>(for inputArgument: Any?) -> T? {
        guard let argumentsDictionary = inputArgument as? [String: Any],
              let argumentsData = try? JSONSerialization.data(withJSONObject: argumentsDictionary),
              let argumentsModel = try? JSONDecoder().decode(T.self, from: argumentsData)
        else { return nil }
        return argumentsModel
    }
    
    func present(_ viewController: UIViewController, _ completionHandler: (() -> Void)?) {
        let showNewViewController: () -> Void = {
            self.viewController.present(viewController, animated: true, completion: completionHandler)
        }
        
        if let presentedViewController = self.viewController.presentedViewController, presentedViewController == self.openedViewController {
            presentedViewController.dismiss(animated: true, completion: showNewViewController)
        } else {
            showNewViewController()
        }
    }
    
    func sendSuccess(_ eventType: OSIABEventType? = nil, for callbackId: String) {
        let pluginResult: CDVPluginResult
        if let eventType {
            pluginResult = .init(status: .ok, messageAs: eventType.rawValue)
        } else {
            pluginResult = .init(status: .ok)
        }
        pluginResult.keepCallback = true
        self.commandDelegate.send(pluginResult, callbackId: callbackId)
    }
    
    func send(error: OSInAppBrowserError, for callbackId: String) {
        let pluginResult = CDVPluginResult(status: .error, messageAs: error.toDictionary())
        self.commandDelegate.send(pluginResult, callbackId: callbackId)
    }
}

private extension OSInAppBrowserEngine {
    func openExternalBrowser(_ url: URL, _ completionHandler: @escaping (Bool) -> Void) {
        let router = OSIABApplicationRouterAdapter(UIApplication.shared)
        self.openExternalBrowser(url, routerDelegate: router, completionHandler)
    }
    
    func openSystemBrowser(_ url: URL, _ options: OSIABSystemBrowserOptions, _ completionHandler: @escaping (OSIABEventType, UIViewController?) -> Void) {
        let router = OSIABSafariViewControllerRouterAdapter(
            options,
            onBrowserPageLoad: { completionHandler(.pageLoadCompleted, nil) },
            onBrowserClosed: { completionHandler(.pageClosed, nil) }
        )
        self.openSystemBrowser(url, routerDelegate: router) { completionHandler(.success, $0) }
    }
    
    func openWebView(
        _ url: URL,
        _ options: OSIABWebViewOptions,
        onDelegateClose: @escaping () -> Void,
        onDelegateURL: @escaping (URL) -> Void,
        onDelegateAlertController: @escaping (UIAlertController) -> Void,
        _ completionHandler: @escaping (OSIABEventType, UIViewController?) -> Void
    ) {
        let callbackHandler = OSIABWebViewCallbackHandler(
            onDelegateURL: onDelegateURL,
            onDelegateAlertController: onDelegateAlertController,
            onBrowserPageLoad: { completionHandler(.pageLoadCompleted, nil) },
            onBrowserClosed: { isAlreadyClosed in
                if !isAlreadyClosed {
                    onDelegateClose()
                }
                completionHandler(.pageClosed, nil)
            }
        )
        let router = OSIABWebViewRouterAdapter(options, cacheManager: OSIABBrowserCacheManager(dataStore: .default()), callbackHandler: callbackHandler)
        self.openWebView(url, routerDelegate: router) { completionHandler(.success, $0) }
    }
}
 
enum OSIABEventType: Int {
    case success = 1
    case pageClosed
    case pageLoadCompleted
}
