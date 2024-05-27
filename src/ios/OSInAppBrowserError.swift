enum OSInAppBrowserTarget {
    case openInExternalBrowser
}

enum OSInAppBrowserError: Error {
    case inputArgumentsIssue(target: OSInAppBrowserTarget)
    case openExternalBrowserFailed(forURL: String)
    
    private var code: Int {
        var result: Int
        
        switch self {
        case .inputArgumentsIssue: result = 0
        case .openExternalBrowserFailed: result = 0
        }
        
        return result
    }
    
    private var description: String {
        var result: String
        
        switch self {
        case .inputArgumentsIssue: result = "The input parameters for 'openInExternalBrowser' are invalid."
        case .openExternalBrowserFailed(let url): result = "Couldn't open '\(url)' using Safari."
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
