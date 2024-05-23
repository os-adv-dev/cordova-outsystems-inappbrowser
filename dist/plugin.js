(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("cordova")) : typeof define === "function" && define.amd ? define(["exports", "cordova"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.OSInAppBrowser = {}, global.cordova));
})(this, function(exports2, cordova) {
  "use strict";
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
  const DefaultAndroidWebViewOptions = {
    allowZoom: false,
    hardwareBack: true,
    pauseMedia: true
  };
  const DefaultiOSWebViewOptions = {
    allowOverScroll: true,
    enableViewportScale: false,
    allowInLineMediaPlayback: false,
    keyboardDisplayRequiresUserAction: true,
    surpressedIncrementalRendering: false,
    viewStyle: iOSViewStyle.PAGE_SHEET,
    animation: iOSAnimation.FLIP_HORIZONTAL
  };
  const DefaultWebViewOptions = {
    showToolBar: true,
    showURL: false,
    clearCache: true,
    clearSessionCache: true,
    mediaPlaybackRequiresUserAction: false,
    closeButtonText: "Close",
    toolbarPosition: ToolbarPosition.TOP,
    showNatigationButtons: true,
    leftToRight: false,
    android: DefaultAndroidWebViewOptions,
    iOS: DefaultiOSWebViewOptions
  };
  const DefaultiOSSystemBrowserOptions = {
    closeButtonText: DismissStyle.CLOSE,
    viewStyle: iOSViewStyle.PAGE_SHEET,
    animationEffect: iOSAnimation.FLIP_HORIZONTAL,
    enableBarsCollapsing: true,
    enableReadersMode: false
  };
  const DefaultAndroidSystemBrowserOptions = {
    showTitle: false,
    hideToolbarOnScroll: false,
    viewStyle: AndroidViewStyle.BOTTOM_SHEET,
    startAnimation: AndroidAnimation.FADE_IN,
    exitAnimation: AndroidAnimation.FADE_IN
  };
  const DefaultSystemBrowserOptions = {
    android: DefaultAndroidSystemBrowserOptions,
    iOS: DefaultiOSSystemBrowserOptions,
    clearCache: false,
    clearSessionCache: false,
    mediaPlaybackRequiresUserAction: false
  };
  var exec = cordova.require("cordova/exec");
  function openInWebView(url, options, success, error, browserCallbacks) {
    options = options || DefaultWebViewOptions;
    console.log(`open in web view for url ${url}
 with options: ${JSON.stringify(options)}`);
    if (browserCallbacks)
      console.log(`with browser callbacks ${JSON.stringify(browserCallbacks)}`);
    exec(success, error, "OSInAppBrowser", "coolMethod", [{ url, options, browserCallbacks }]);
  }
  function openInSystemBrowser(url, options, success, error, browserCallbacks) {
    options = options || DefaultSystemBrowserOptions;
    console.log(`open in system browser view for url ${url}
 with options: ${JSON.stringify(options)}`);
    if (browserCallbacks)
      console.log(`with browser callbacks ${JSON.stringify(browserCallbacks)}`);
    exec(success, error, "OSInAppBrowser", "coolMethod", [{ url, options, browserCallbacks }]);
  }
  function openInExternalBrowser(url, success, error) {
    console.log("open in external browser view...");
    exec(success, error, "OSInAppBrowser", "coolMethod", [{ url }]);
  }
  function close() {
    console.log("close view...");
    exec(() => {
    }, () => {
    }, "OSInAppBrowser", "coolMethod", [{}]);
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
  exports2.AndroidAnimation = AndroidAnimation;
  exports2.AndroidViewStyle = AndroidViewStyle;
  exports2.DismissStyle = DismissStyle;
  exports2.ToolbarPosition = ToolbarPosition;
  exports2.iOSAnimation = iOSAnimation;
  exports2.iOSViewStyle = iOSViewStyle;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
