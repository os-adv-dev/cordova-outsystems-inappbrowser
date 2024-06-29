import { require as require2 } from "cordova";
var ToolbarPosition = /* @__PURE__ */ ((ToolbarPosition2) => {
  ToolbarPosition2[ToolbarPosition2["TOP"] = 0] = "TOP";
  ToolbarPosition2[ToolbarPosition2["BOTTOM"] = 1] = "BOTTOM";
  return ToolbarPosition2;
})(ToolbarPosition || {});
var iOSViewStyle = /* @__PURE__ */ ((iOSViewStyle2) => {
  iOSViewStyle2[iOSViewStyle2["PAGE_SHEET"] = 0] = "PAGE_SHEET";
  iOSViewStyle2[iOSViewStyle2["FORM_SHEET"] = 1] = "FORM_SHEET";
  iOSViewStyle2[iOSViewStyle2["FULL_SCREEN"] = 2] = "FULL_SCREEN";
  return iOSViewStyle2;
})(iOSViewStyle || {});
var AndroidViewStyle = /* @__PURE__ */ ((AndroidViewStyle2) => {
  AndroidViewStyle2[AndroidViewStyle2["BOTTOM_SHEET"] = 0] = "BOTTOM_SHEET";
  AndroidViewStyle2[AndroidViewStyle2["FULL_SCREEN"] = 1] = "FULL_SCREEN";
  return AndroidViewStyle2;
})(AndroidViewStyle || {});
var iOSAnimation = /* @__PURE__ */ ((iOSAnimation2) => {
  iOSAnimation2[iOSAnimation2["FLIP_HORIZONTAL"] = 0] = "FLIP_HORIZONTAL";
  iOSAnimation2[iOSAnimation2["CROSS_DISSOLVE"] = 1] = "CROSS_DISSOLVE";
  iOSAnimation2[iOSAnimation2["COVER_VERTICAL"] = 2] = "COVER_VERTICAL";
  return iOSAnimation2;
})(iOSAnimation || {});
var AndroidAnimation = /* @__PURE__ */ ((AndroidAnimation2) => {
  AndroidAnimation2[AndroidAnimation2["FADE_IN"] = 0] = "FADE_IN";
  AndroidAnimation2[AndroidAnimation2["FADE_OUT"] = 1] = "FADE_OUT";
  AndroidAnimation2[AndroidAnimation2["SLIDE_IN_LEFT"] = 2] = "SLIDE_IN_LEFT";
  AndroidAnimation2[AndroidAnimation2["SLIDE_OUT_RIGHT"] = 3] = "SLIDE_OUT_RIGHT";
  return AndroidAnimation2;
})(AndroidAnimation || {});
var DismissStyle = /* @__PURE__ */ ((DismissStyle2) => {
  DismissStyle2[DismissStyle2["CLOSE"] = 0] = "CLOSE";
  DismissStyle2[DismissStyle2["CANCEL"] = 1] = "CANCEL";
  DismissStyle2[DismissStyle2["DONE"] = 2] = "DONE";
  return DismissStyle2;
})(DismissStyle || {});
var CallbackEvent = /* @__PURE__ */ ((CallbackEvent2) => {
  CallbackEvent2[CallbackEvent2["SUCCESS"] = 1] = "SUCCESS";
  CallbackEvent2[CallbackEvent2["PAGE_CLOSED"] = 2] = "PAGE_CLOSED";
  CallbackEvent2[CallbackEvent2["PAGE_LOAD_COMPLETED"] = 3] = "PAGE_LOAD_COMPLETED";
  return CallbackEvent2;
})(CallbackEvent || {});
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
function trigger(type, success, onbrowserClosed = void 0, onbrowserPageLoaded = void 0) {
  switch (type) {
    case CallbackEvent.SUCCESS:
      success();
      break;
    case CallbackEvent.PAGE_CLOSED:
      if (onbrowserClosed) {
        onbrowserClosed();
      }
      break;
    case CallbackEvent.PAGE_LOAD_COMPLETED:
      if (onbrowserPageLoaded) {
        onbrowserPageLoaded();
      }
      break;
  }
}
function openInWebView(url, options, success, error, browserCallbacks) {
  options = options || DefaultWebViewOptions;
  let triggerCorrectCallback = function(result) {
    if (result) {
      if (browserCallbacks) {
        trigger(result, success, browserCallbacks.onbrowserClosed, browserCallbacks.onbrowserPageLoaded);
      } else {
        trigger(result, success);
      }
    }
  };
  exec(triggerCorrectCallback, error, "OSInAppBrowser", "openInWebView", [{ url, options }]);
}
function openInSystemBrowser(url, options, success, error, browserCallbacks) {
  options = options || DefaultSystemBrowserOptions;
  let triggerCorrectCallback = function(result) {
    if (result) {
      if (browserCallbacks) {
        trigger(result, success, browserCallbacks.onbrowserClosed, browserCallbacks.onbrowserPageLoaded);
      } else {
        trigger(result, success);
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
function removeAllListeners() {
  console.log("remove all listeners...");
  exec(() => {
  }, () => {
  }, "OSInAppBrowser", "coolMethod", [{}]);
}
async function addListener(eventName, listenerFunc) {
  console.log("add listener...");
  exec(() => {
  }, () => {
  }, "OSInAppBrowser", "coolMethod", [{ eventName, listenerFunc }]);
  return {
    remove: () => {
      return Promise.resolve();
    }
  };
}
module.exports = {
  openInWebView,
  openInExternalBrowser,
  openInSystemBrowser,
  close,
  removeAllListeners,
  addListener
};
export {
  AndroidAnimation,
  AndroidViewStyle,
  CallbackEvent,
  DismissStyle,
  ToolbarPosition,
  iOSAnimation,
  iOSViewStyle
};
