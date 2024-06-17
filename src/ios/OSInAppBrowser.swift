import OSInAppBrowserLib
import UIKit

typealias OSInAppBrowserEngine = OSIABEngine<OSIABApplicationRouterAdapter, OSIABSafariViewControllerRouterAdapter, OSIABWebViewRouterAdapter>

/// The plugin's main class
@objc(OSInAppBrowser)
class OSInAppBrowser: CDVPlugin {
    /// The native library's main class
    private var plugin: OSInAppBrowserEngine?
    private var openedRouter: (any OSIABRouter)?
    
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
                self.openedRouter = self.plugin?.openSystemBrowser(url, options, { [weak self] event, safariViewController in
                    guard let self else { return }
                    
                    if event == .success {
                        if let safariViewController {
                            self.viewController.show(safariViewController, sender: nil)
                        } else {
                            self.send(error: .failedToOpen(url: url.absoluteString, onTarget: target), for: command.callbackId)
                        }
                    }
                    
                    self.sendSuccess(event, for: command.callbackId)
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
                self.openedRouter = self.plugin?.openWebView(
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
                    }, { [weak self] event, viewController in
                        guard let self else { return }
                        
                        if event == .success {
                            if let viewController {
                                self.viewController.show(viewController, sender: nil)
                            } else {
                                self.send(error: .failedToOpen(url: url.absoluteString, onTarget: target), for: command.callbackId)
                            }
                        }
                        
                        self.sendSuccess(event, for: command.callbackId)
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
    
    @objc(coolMethod:)
    func coolMethod(command: CDVInvokedUrlCommand) {
        //TODO
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
}

private extension OSInAppBrowser {
    func createModel<T: Decodable>(for inputArgument: Any?) -> T? {
        guard let argumentsDictionary = inputArgument as? [String: Any],
              let argumentsData = try? JSONSerialization.data(withJSONObject: argumentsDictionary),
              let argumentsModel = try? JSONDecoder().decode(T.self, from: argumentsData)
        else { return nil }
        return argumentsModel
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
    
    func openSystemBrowser(_ url: URL, _ options: OSIABSystemBrowserOptions, _ completionHandler: @escaping (OSIABEventType, UIViewController?) -> Void) -> SystemBrowser {
        let router = OSIABSafariViewControllerRouterAdapter(
            options,
            onBrowserPageLoad: { completionHandler(.pageLoadCompleted, nil) },
            onBrowserClosed: { completionHandler(.pageClosed, nil) }
        )
        self.openSystemBrowser(url, routerDelegate: router) { completionHandler(.success, $0) }
        return router
    }
    
    func openWebView(
        _ url: URL,
        _ options: OSIABWebViewOptions,
        onDelegateClose: @escaping () -> Void,
        onDelegateURL: @escaping (URL) -> Void,
        onDelegateAlertController: @escaping (UIAlertController) -> Void,
        _ completionHandler: @escaping (OSIABEventType, UIViewController?) -> Void
    ) -> WebView {
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
        return router
    }
}
 
enum OSIABEventType: Int {
    case success = 1
    case pageClosed
    case pageLoadCompleted
}
