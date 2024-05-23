export declare enum ToolbarPosition {
    TOP = 0,
    BOTTOM = 1
}
export interface PluginListenerHandle {
    remove: () => Promise<void>;
}
export declare enum iOSViewStyle {
    PAGE_SHEET = 0,
    FORM_SHEET = 1,
    FULL_SCREEN = 2
}
export declare enum AndroidViewStyle {
    BOTTOM_SHEET = 0,
    FULL_SCREEN = 1
}
export declare enum iOSAnimation {
    FLIP_HORIZONTAL = 0,
    CROSS_DISSOLVE = 1,
    COVER_VERTICAL = 2
}
export declare enum AndroidAnimation {
    FADE_IN = 0,
    FADE_OUT = 1,
    SLIDE_IN_LEFT = 2,
    SLIDE_OUT_RIGHT = 3
}
export type PluginError = {
    code: string;
    message: string;
};
export interface CommonOptions {
    clearCache: boolean;
    clearSessionCache: boolean;
    mediaPlaybackRequiresUserAction: boolean;
}
export interface WebViewOptions extends CommonOptions {
    showURL: boolean;
    showToolBar: boolean;
    closeButtonText: string;
    toolbarPosition: ToolbarPosition;
    showNatigationButtons: boolean;
    leftToRight: boolean;
    android: AndroidWebViewOptions;
    iOS: iOSWebViewOptions;
}
export interface iOSWebViewOptions {
    allowOverScroll: boolean;
    enableViewportScale: boolean;
    allowInLineMediaPlayback: boolean;
    keyboardDisplayRequiresUserAction: boolean;
    surpressedIncrementalRendering: boolean;
    viewStyle: iOSViewStyle;
    animation: iOSAnimation;
}
export interface AndroidWebViewOptions {
    allowZoom: boolean;
    hardwareBack: boolean;
    pauseMedia: boolean;
}
export declare enum DismissStyle {
    CLOSE = 0,
    CANCEL = 1,
    DONE = 2
}
export interface SystemBrowserOptions extends CommonOptions {
    android: AndroidSystemBrowserOptions;
    iOS: iOSSystemBrowserOptions;
}
export interface iOSSystemBrowserOptions {
    closeButtonText: DismissStyle;
    viewStyle: iOSViewStyle;
    animationEffect: iOSAnimation;
    enableBarsCollapsing: boolean;
    enableReadersMode: boolean;
}
export interface AndroidBottomSheetOptions {
    height: number;
    isFixed: boolean;
}
export interface AndroidSystemBrowserOptions {
    showTitle: boolean;
    hideToolbarOnScroll: boolean;
    viewStyle: AndroidViewStyle;
    bottomSheetOptions?: AndroidBottomSheetOptions;
    startAnimation: AndroidAnimation;
    exitAnimation: AndroidAnimation;
}
export interface BrowserCallbacks {
    onbrowserClosed: () => void;
    onbrowserPageLoaded: () => void;
}
