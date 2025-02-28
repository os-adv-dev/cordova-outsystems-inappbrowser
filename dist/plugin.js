(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("cordova")) : typeof define === "function" && define.amd ? define(["exports", "cordova"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.OSInAppBrowser = {}, global.cordova));
})(this, function(exports2, cordova) {
  "use strict";
  exports2.ToolbarPosition = void 0;
  (function(ToolbarPosition) {
    ToolbarPosition[ToolbarPosition["TOP"] = 0] = "TOP";
    ToolbarPosition[ToolbarPosition["BOTTOM"] = 1] = "BOTTOM";
  })(exports2.ToolbarPosition || (exports2.ToolbarPosition = {}));
  exports2.iOSViewStyle = void 0;
  (function(iOSViewStyle) {
    iOSViewStyle[iOSViewStyle["PAGE_SHEET"] = 0] = "PAGE_SHEET";
    iOSViewStyle[iOSViewStyle["FORM_SHEET"] = 1] = "FORM_SHEET";
    iOSViewStyle[iOSViewStyle["FULL_SCREEN"] = 2] = "FULL_SCREEN";
  })(exports2.iOSViewStyle || (exports2.iOSViewStyle = {}));
  exports2.AndroidViewStyle = void 0;
  (function(AndroidViewStyle) {
    AndroidViewStyle[AndroidViewStyle["BOTTOM_SHEET"] = 0] = "BOTTOM_SHEET";
    AndroidViewStyle[AndroidViewStyle["FULL_SCREEN"] = 1] = "FULL_SCREEN";
  })(exports2.AndroidViewStyle || (exports2.AndroidViewStyle = {}));
  exports2.iOSAnimation = void 0;
  (function(iOSAnimation) {
    iOSAnimation[iOSAnimation["FLIP_HORIZONTAL"] = 0] = "FLIP_HORIZONTAL";
    iOSAnimation[iOSAnimation["CROSS_DISSOLVE"] = 1] = "CROSS_DISSOLVE";
    iOSAnimation[iOSAnimation["COVER_VERTICAL"] = 2] = "COVER_VERTICAL";
  })(exports2.iOSAnimation || (exports2.iOSAnimation = {}));
  exports2.AndroidAnimation = void 0;
  (function(AndroidAnimation) {
    AndroidAnimation[AndroidAnimation["FADE_IN"] = 0] = "FADE_IN";
    AndroidAnimation[AndroidAnimation["FADE_OUT"] = 1] = "FADE_OUT";
    AndroidAnimation[AndroidAnimation["SLIDE_IN_LEFT"] = 2] = "SLIDE_IN_LEFT";
    AndroidAnimation[AndroidAnimation["SLIDE_OUT_RIGHT"] = 3] = "SLIDE_OUT_RIGHT";
  })(exports2.AndroidAnimation || (exports2.AndroidAnimation = {}));
  exports2.DismissStyle = void 0;
  (function(DismissStyle) {
    DismissStyle[DismissStyle["CLOSE"] = 0] = "CLOSE";
    DismissStyle[DismissStyle["CANCEL"] = 1] = "CANCEL";
    DismissStyle[DismissStyle["DONE"] = 2] = "DONE";
  })(exports2.DismissStyle || (exports2.DismissStyle = {}));
  exports2.CallbackEventType = void 0;
  (function(CallbackEventType) {
    CallbackEventType[CallbackEventType["SUCCESS"] = 1] = "SUCCESS";
    CallbackEventType[CallbackEventType["PAGE_CLOSED"] = 2] = "PAGE_CLOSED";
    CallbackEventType[CallbackEventType["PAGE_LOAD_COMPLETED"] = 3] = "PAGE_LOAD_COMPLETED";
    CallbackEventType[CallbackEventType["PAGE_NAVIGATED"] = 4] = "PAGE_NAVIGATED";
  })(exports2.CallbackEventType || (exports2.CallbackEventType = {}));
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
    viewStyle: exports2.iOSViewStyle.FULL_SCREEN,
    animationEffect: exports2.iOSAnimation.COVER_VERTICAL
  };
  const DefaultWebViewOptions = {
    showToolbar: true,
    showURL: true,
    clearCache: true,
    clearSessionCache: true,
    mediaPlaybackRequiresUserAction: false,
    closeButtonText: "Close",
    toolbarPosition: exports2.ToolbarPosition.TOP,
    showNavigationButtons: true,
    leftToRight: false,
    android: DefaultAndroidWebViewOptions,
    iOS: DefaultiOSWebViewOptions,
    customWebViewUserAgent: null
  };
  const DefaultiOSSystemBrowserOptions = {
    closeButtonText: exports2.DismissStyle.DONE,
    viewStyle: exports2.iOSViewStyle.FULL_SCREEN,
    animationEffect: exports2.iOSAnimation.COVER_VERTICAL,
    enableBarsCollapsing: true,
    enableReadersMode: false
  };
  const DefaultAndroidSystemBrowserOptions = {
    showTitle: false,
    hideToolbarOnScroll: false,
    viewStyle: exports2.AndroidViewStyle.BOTTOM_SHEET,
    startAnimation: exports2.AndroidAnimation.FADE_IN,
    exitAnimation: exports2.AndroidAnimation.FADE_OUT
  };
  const DefaultSystemBrowserOptions = {
    android: DefaultAndroidSystemBrowserOptions,
    iOS: DefaultiOSSystemBrowserOptions
  };
  var exec = cordova.require("cordova/exec");
  function trigger(type, success, data, onbrowserClosed = void 0, onbrowserPageLoaded = void 0, onbrowserNavigated = void 0) {
    switch (type) {
      case exports2.CallbackEventType.SUCCESS:
        success();
        break;
      case exports2.CallbackEventType.PAGE_CLOSED:
        if (onbrowserClosed) {
          onbrowserClosed();
        }
        break;
      case exports2.CallbackEventType.PAGE_LOAD_COMPLETED:
        if (onbrowserPageLoaded) {
          onbrowserPageLoaded();
        }
        break;
      case exports2.CallbackEventType.PAGE_NAVIGATED:
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
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
