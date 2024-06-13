import { require } from "cordova";
import { BrowserCallbacks, PluginError, PluginListenerHandle, SystemBrowserOptions, WebViewOptions, CallbackEvent } from "./definitions";
import { DefaultSystemBrowserOptions, DefaultWebViewOptions } from "./defaults";
var exec = require('cordova/exec')

function trigger(type: CallbackEvent, success: () => void, onbrowserClosed: (() => void) | undefined = undefined, onbrowserPageLoaded: (() => void) | undefined = undefined) {
  switch (type) {
  case CallbackEvent.SUCCESS: 
    success();
    break
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
  default: break;
  }
}

function openInWebView(url: string, options: WebViewOptions,  success: () => void, error: (error: PluginError) => void,  browserCallbacks?: BrowserCallbacks): void {
  options = options || DefaultWebViewOptions;
  console.log(`open in web view for url ${url}\n with options: ${JSON.stringify(options)}`);
  
  if(browserCallbacks)
    console.log(`with browser callbacks ${JSON.stringify(browserCallbacks)}`)

  exec(success, error, 'OSInAppBrowser', 'coolMethod', [{url, options, browserCallbacks}])
}

function openInSystemBrowser(url: string, options: SystemBrowserOptions, success: () => void, error: (error: PluginError) => void, browserCallbacks?: BrowserCallbacks): void {
  options = options || DefaultSystemBrowserOptions;
  
  let triggerCorrectCallback = function (result: CallbackEvent) {
    if (result) {
      if (browserCallbacks) {
        trigger(result, success, browserCallbacks.onbrowserClosed, browserCallbacks.onbrowserPageLoaded);
      } else {
        trigger(result, success);
      }
    }
  };

  exec(triggerCorrectCallback, error, 'OSInAppBrowser', 'openInSystemBrowser', [{url, options}])  
}

function openInExternalBrowser(url: string, success: () => void, error: (error: PluginError) => void): void {
  exec(success, error, 'OSInAppBrowser', 'openInExternalBrowser', [{url}])
}
function close(): void {
  console.log("close view...");
  exec(()=>{}, () =>{}, 'OSInAppBrowser', 'coolMethod', [{}])
}
function removeAllListeners(): void {
  console.log("remove all listeners...");
  exec(()=>{}, () =>{}, 'OSInAppBrowser', 'coolMethod', [{}])
}
async function addListener(eventName: 'browserClosed' | 'browserPageLoaded', listenerFunc: () => void): Promise<PluginListenerHandle> {
  console.log("add listener...");
  exec(()=>{}, () =>{}, 'OSInAppBrowser', 'coolMethod', [{eventName, listenerFunc}])
  return {
    remove: () => {
      return Promise.resolve();
    }
  }
}

module.exports = {
  openInWebView,
  openInExternalBrowser,
  openInSystemBrowser,
  close,
  removeAllListeners,
  addListener
}