import OSInAppBrowserLib

class OSInAppBrowserInputArgumentsSimpleModel: Decodable {
    let url: String
}

class OSInAppBrowserInputArgumentsSystemBrowserModel: OSInAppBrowserInputArgumentsSimpleModel {
    struct Options: Decodable {
        struct iOS: Decodable {
            let closeButtonText: OSIABDismissStyle?
            let viewStyle: OSIABViewStyle?
            let animationEffect: OSIABAnimationEffect?
            let enableBarsCollapsing: Bool?
            let enableReadersMode: Bool?
        }
        
        let iOS: iOS
    }
    
    let options: Options
    
    enum CodingKeys: CodingKey {
        case options
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.options = try container.decode(Options.self, forKey: .options)
        try super.init(from: decoder)
    }
}

extension OSInAppBrowserInputArgumentsSystemBrowserModel {
    func toOptions() -> OSIABSystemBrowserOptions {
        .init(
            dismissStyle: self.options.iOS.closeButtonText ?? .defaultValue,
            viewStyle: self.options.iOS.viewStyle ?? .defaultValue,
            animationEffect: self.options.iOS.animationEffect ?? .defaultValue,
            enableBarsCollapsing: self.options.iOS.enableBarsCollapsing ?? true,
            enableReadersMode: self.options.iOS.enableReadersMode ?? false
        )
    }
}

extension OSIABDismissStyle: Decodable {}
extension OSIABViewStyle: Decodable {}
extension OSIABAnimationEffect: Decodable {}
