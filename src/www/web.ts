import { require } from "cordova";
import { BrowserCallbacks, PluginError, SystemBrowserOptions, WebViewOptions, CallbackEvent, CallbackEventType, CallbackEventData } from "./definitions";
import { DefaultSystemBrowserOptions, DefaultWebViewOptions } from "./defaults";
var exec = require('cordova/exec')

function trigger(type: CallbackEventType, success: () => void, data?: CallbackEventData, onbrowserClosed: (() => void) | undefined = undefined, onbrowserPageLoaded: (() => void) | undefined = undefined, onbrowserNavigated: ((data?: CallbackEventData) => void) | undefined = undefined) {
  switch (type) {
  case CallbackEventType.SUCCESS: 
    success();
    break
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
  default: break;
  }
}

function openInWebView(url: string, options: WebViewOptions,  success: () => void, error: (error: PluginError) => void,  browserCallbacks?: BrowserCallbacks): void {
  options = options || DefaultWebViewOptions;
  
  let triggerCorrectCallback = function (result: string) {
    const parsedResult: CallbackEvent = JSON.parse(result);
    if (parsedResult) {
      if (browserCallbacks) {
        trigger(parsedResult.eventType, success, parsedResult.data, browserCallbacks.onbrowserClosed, browserCallbacks.onbrowserPageLoaded, browserCallbacks.onbrowserNavigated);
      } else {
        trigger(parsedResult.eventType, success, parsedResult.data);
      }
    }
  };

  exec(triggerCorrectCallback, error, 'OSInAppBrowser', 'openInWebView', [{url, options}]);
}

function openInSystemBrowser(url: string, options: SystemBrowserOptions, success: () => void, error: (error: PluginError) => void, browserCallbacks?: BrowserCallbacks): void {
  options = options || DefaultSystemBrowserOptions;
  
  let triggerCorrectCallback = function (result: string) {
    const parsedResult: CallbackEvent = JSON.parse(result);
    if (parsedResult) {
      if (browserCallbacks) {
        trigger(parsedResult.eventType, success, parsedResult.data, browserCallbacks.onbrowserClosed, browserCallbacks.onbrowserPageLoaded);
      } else {
        trigger(parsedResult.eventType, success);
      }
    }
  };

  exec(triggerCorrectCallback, error, 'OSInAppBrowser', 'openInSystemBrowser', [{url, options}]);
}

function openInExternalBrowser(url: string, success: () => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSInAppBrowser', 'openInExternalBrowser', [{url}])
}

function close(success: () => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSInAppBrowser', 'close', [{}])  
}

module.exports = {
  openInWebView,
  openInExternalBrowser,
  openInSystemBrowser,
  close
}