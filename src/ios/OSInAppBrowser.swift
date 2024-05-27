import OSInAppBrowserLib
import UIKit

/// The plugin's main class
@objc(OSInAppBrowser)
class OSInAppBrowser: CDVPlugin {
    /// The native library's main class
    private var plugin: OSIABEngine?
    
    override func pluginInitialize() {
        self.plugin = .init(application: .shared)
    }
    
    @objc(openInExternalBrowser:)
    func openInExternalBrowser(command: CDVInvokedUrlCommand) {
        self.commandDelegate.run { [weak self] in
            guard let self = self else { return }
            
            guard let argumentsDictionary = command.argument(at: 0) as? [String: Any],
                  let argumentsData = try? JSONSerialization.data(withJSONObject: argumentsDictionary),
                  let argumentsModel = try? JSONDecoder().decode(OSInAppBrowserInputArgumentsModel.self, from: argumentsData)
            else {
                return self.send(error: .inputArgumentsIssue(target: .openInExternalBrowser), for: command.callbackId)
            }
            
            if self.plugin?.openExternalBrowser(argumentsModel.url) == true {
                self.sendSuccess(for: command.callbackId)
            } else {
                self.send(error: .openExternalBrowserFailed(forURL: argumentsModel.url), for: command.callbackId)
            }
        }
    }

    @objc(coolMethod:)
    func coolMethod(command: CDVInvokedUrlCommand) {
        //TODO
    }
}

private extension OSInAppBrowser {
    func sendSuccess(for callbackId: String) {
        let pluginResult = CDVPluginResult(status: .ok)
        self.commandDelegate.send(pluginResult, callbackId: callbackId)
    }
    
    func send(error: OSInAppBrowserError, for callbackId: String) {
        let pluginResult = CDVPluginResult(status: .error, messageAs: error.toDictionary())
        self.commandDelegate.send(pluginResult, callbackId: callbackId)
    }
}
