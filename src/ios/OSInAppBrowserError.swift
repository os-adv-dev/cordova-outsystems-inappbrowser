enum OSInAppBrowserTarget {
    case externalBrowser
    case systemBrowser
    case webView
}

enum OSInAppBrowserError: Error {
    case inputArgumentsIssue(target: OSInAppBrowserTarget)
    case failedToOpen(url: String, onTarget: OSInAppBrowserTarget)
    
    private var code: Int {
        let result: Int
        
        switch self {
        case .inputArgumentsIssue: result = 0
        case .failedToOpen: result = 0
        }
        
        return result
    }
    
    private var description: String {
        let result: String
        
        switch self {
        case .inputArgumentsIssue(let target):             
            let targetString: String
            
            switch target {
            case .externalBrowser: targetString = "openInExternalBrowser"
            case .systemBrowser: targetString = "openInSystemBrowser"
            case .webView: targetString = "openInWebView"
            }
            
            result = "The input parameters for '\(targetString)' are invalid."
        case .failedToOpen(url: let url, onTarget: let target):
            let targetString: String
            
            switch target {
            case .externalBrowser: targetString = "Safari"
            case .systemBrowser: targetString = "SFSafariViewController"
            case .webView: targetString = "WebView"
            }
            
            result = "Couldn't open '\(url)' using \(targetString)."
        }
        
        return result
    }
    
    func toDictionary() -> [String: String] {
        [
            "code": "OS-PLUG-IABP-\(String(format: "%04d", self.code))",
            "message": self.description
        ]
    }   
}
