import { require as require2 } from "cordova";
var ToolbarPosition;
(function(ToolbarPosition2) {
  ToolbarPosition2[ToolbarPosition2["TOP"] = 0] = "TOP";
  ToolbarPosition2[ToolbarPosition2["BOTTOM"] = 1] = "BOTTOM";
})(ToolbarPosition || (ToolbarPosition = {}));
var iOSViewStyle;
(function(iOSViewStyle2) {
  iOSViewStyle2[iOSViewStyle2["PAGE_SHEET"] = 0] = "PAGE_SHEET";
  iOSViewStyle2[iOSViewStyle2["FORM_SHEET"] = 1] = "FORM_SHEET";
  iOSViewStyle2[iOSViewStyle2["FULL_SCREEN"] = 2] = "FULL_SCREEN";
})(iOSViewStyle || (iOSViewStyle = {}));
var AndroidViewStyle;
(function(AndroidViewStyle2) {
  AndroidViewStyle2[AndroidViewStyle2["BOTTOM_SHEET"] = 0] = "BOTTOM_SHEET";
  AndroidViewStyle2[AndroidViewStyle2["FULL_SCREEN"] = 1] = "FULL_SCREEN";
})(AndroidViewStyle || (AndroidViewStyle = {}));
var iOSAnimation;
(function(iOSAnimation2) {
  iOSAnimation2[iOSAnimation2["FLIP_HORIZONTAL"] = 0] = "FLIP_HORIZONTAL";
  iOSAnimation2[iOSAnimation2["CROSS_DISSOLVE"] = 1] = "CROSS_DISSOLVE";
  iOSAnimation2[iOSAnimation2["COVER_VERTICAL"] = 2] = "COVER_VERTICAL";
})(iOSAnimation || (iOSAnimation = {}));
var AndroidAnimation;
(function(AndroidAnimation2) {
  AndroidAnimation2[AndroidAnimation2["FADE_IN"] = 0] = "FADE_IN";
  AndroidAnimation2[AndroidAnimation2["FADE_OUT"] = 1] = "FADE_OUT";
  AndroidAnimation2[AndroidAnimation2["SLIDE_IN_LEFT"] = 2] = "SLIDE_IN_LEFT";
  AndroidAnimation2[AndroidAnimation2["SLIDE_OUT_RIGHT"] = 3] = "SLIDE_OUT_RIGHT";
})(AndroidAnimation || (AndroidAnimation = {}));
var DismissStyle;
(function(DismissStyle2) {
  DismissStyle2[DismissStyle2["CLOSE"] = 0] = "CLOSE";
  DismissStyle2[DismissStyle2["CANCEL"] = 1] = "CANCEL";
  DismissStyle2[DismissStyle2["DONE"] = 2] = "DONE";
})(DismissStyle || (DismissStyle = {}));
var CallbackEventType;
(function(CallbackEventType2) {
  CallbackEventType2[CallbackEventType2["SUCCESS"] = 1] = "SUCCESS";
  CallbackEventType2[CallbackEventType2["PAGE_CLOSED"] = 2] = "PAGE_CLOSED";
  CallbackEventType2[CallbackEventType2["PAGE_LOAD_COMPLETED"] = 3] = "PAGE_LOAD_COMPLETED";
  CallbackEventType2[CallbackEventType2["PAGE_NAVIGATED"] = 4] = "PAGE_NAVIGATED";
})(CallbackEventType || (CallbackEventType = {}));
const DefaultAndroidWebViewOptions = {
  allowZoom: false,
  hardwareBack: true,
  pauseMedia: true
};
const DefaultiOSWebViewOptions = {
  allowOverScroll: true,
  enableViewportScale: false,
  allowInLineMediaPlayback: false,
  surpressIncrementalRendering: false,
  viewStyle: iOSViewStyle.FULL_SCREEN,
  animationEffect: iOSAnimation.COVER_VERTICAL
};
const DefaultWebViewOptions = {
  showToolbar: true,
  showURL: true,
  clearCache: true,
  clearSessionCache: true,
  mediaPlaybackRequiresUserAction: false,
  closeButtonText: "Close",
  toolbarPosition: ToolbarPosition.TOP,
  showNavigationButtons: true,
  leftToRight: false,
  android: DefaultAndroidWebViewOptions,
  iOS: DefaultiOSWebViewOptions,
  customWebViewUserAgent: null
};
const DefaultiOSSystemBrowserOptions = {
  closeButtonText: DismissStyle.DONE,
  viewStyle: iOSViewStyle.FULL_SCREEN,
  animationEffect: iOSAnimation.COVER_VERTICAL,
  enableBarsCollapsing: true,
  enableReadersMode: false
};
const DefaultAndroidSystemBrowserOptions = {
  showTitle: false,
  hideToolbarOnScroll: false,
  viewStyle: AndroidViewStyle.BOTTOM_SHEET,
  startAnimation: AndroidAnimation.FADE_IN,
  exitAnimation: AndroidAnimation.FADE_OUT
};
const DefaultSystemBrowserOptions = {
  android: DefaultAndroidSystemBrowserOptions,
  iOS: DefaultiOSSystemBrowserOptions
};
var exec = require2("cordova/exec");
function trigger(type, success, data, onbrowserClosed = void 0, onbrowserPageLoaded = void 0, onbrowserNavigated = void 0) {
  switch (type) {
    case CallbackEventType.SUCCESS:
      success();
      break;
    case CallbackEventType.PAGE_CLOSED:
      if (onbrowserClosed) {
        onbrowserClosed();
      }
      break;
    case CallbackEventType.PAGE_LOAD_COMPLETED:
      if (onbrowserPageLoaded) {
        onbrowserPageLoaded();
      }
      break;
    case CallbackEventType.PAGE_NAVIGATED:
      if (onbrowserNavigated) {
        onbrowserNavigated(data);
      }
      break;
  }
}
function openInWebView(url, options, success, error, browserCallbacks) {
  options = options || DefaultWebViewOptions;
  let triggerCorrectCallback = function(result) {
    const parsedResult = JSON.parse(result);
    if (parsedResult) {
      if (browserCallbacks) {
        trigger(parsedResult.eventType, success, parsedResult.data, browserCallbacks.onbrowserClosed, browserCallbacks.onbrowserPageLoaded, browserCallbacks.onbrowserNavigated);
      } else {
        trigger(parsedResult.eventType, success, parsedResult.data);
      }
    }
  };
  exec(triggerCorrectCallback, error, "OSInAppBrowser", "openInWebView", [{ url, options }]);
}
function openInSystemBrowser(url, options, success, error, browserCallbacks) {
  options = options || DefaultSystemBrowserOptions;
  let triggerCorrectCallback = function(result) {
    const parsedResult = JSON.parse(result);
    if (parsedResult) {
      if (browserCallbacks) {
        trigger(parsedResult.eventType, success, parsedResult.data, browserCallbacks.onbrowserClosed, browserCallbacks.onbrowserPageLoaded);
      } else {
        trigger(parsedResult.eventType, success);
      }
    }
  };
  exec(triggerCorrectCallback, error, "OSInAppBrowser", "openInSystemBrowser", [{ url, options }]);
}
function openInExternalBrowser(url, success, error) {
  exec(success, error, "OSInAppBrowser", "openInExternalBrowser", [{ url }]);
}
function close(success, error) {
  exec(success, error, "OSInAppBrowser", "close", [{}]);
}
module.exports = {
  openInWebView,
  openInExternalBrowser,
  openInSystemBrowser,
  close
};
export {
  AndroidAnimation,
  AndroidViewStyle,
  CallbackEventType,
  DismissStyle,
  ToolbarPosition,
  iOSAnimation,
  iOSViewStyle
};
