export enum ToolbarPosition {
  TOP,
  BOTTOM
}

export interface PluginListenerHandle {
  remove: () => Promise<void>
}

export enum iOSViewStyle {
  PAGE_SHEET,
  FORM_SHEET,
  FULL_SCREEN
}

export enum AndroidViewStyle {
  BOTTOM_SHEET,
  FULL_SCREEN
}

export enum iOSAnimation {
  FLIP_HORIZONTAL,
  CROSS_DISSOLVE,
  COVER_VERTICAL
}

export enum AndroidAnimation {
  FADE_IN,
  FADE_OUT,
  SLIDE_IN_LEFT,
  SLIDE_OUT_RIGHT  
}

export type PluginError = {
  code: string,
  message: string
}

export interface WebViewOptions {
  showURL: boolean;
  showToolbar: boolean;

  clearCache: boolean;
  clearSessionCache: boolean;
  mediaPlaybackRequiresUserAction: boolean;
  
  closeButtonText: string;
  toolbarPosition: ToolbarPosition;
  
  showNavigationButtons: boolean;
  leftToRight: boolean;
  
  customWebViewUserAgent: String | null;

  android: AndroidWebViewOptions,
  iOS: iOSWebViewOptions
}

export interface iOSWebViewOptions {
  allowOverScroll: boolean;

  enableViewportScale: boolean;
  allowInLineMediaPlayback: boolean;
  surpressIncrementalRendering: boolean;

  viewStyle: iOSViewStyle;
  animationEffect: iOSAnimation;
}

export interface AndroidWebViewOptions {
  allowZoom: boolean;
  hardwareBack: boolean;
  pauseMedia: boolean;
}

export enum DismissStyle {
  CLOSE,
  CANCEL,
  DONE
}


export interface SystemBrowserOptions {
  android: AndroidSystemBrowserOptions,
  iOS: iOSSystemBrowserOptions
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
  onbrowserClosed: () => void,
  onbrowserPageLoaded: () => void
  onbrowserNavigated: (data?: CallbackEventData) => void
}

export enum CallbackEventType {
  SUCCESS = 1,
  PAGE_CLOSED = 2,
  PAGE_LOAD_COMPLETED = 3,
  PAGE_NAVIGATED = 4
} 
export interface CallbackEventData {
  url: string
} 

export interface CallbackEvent {
  eventType: CallbackEventType, 
  data: CallbackEventData
} 

