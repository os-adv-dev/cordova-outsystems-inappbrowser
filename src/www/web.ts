import { require } from "cordova";
import { BrowserCallbacks, PluginError, PluginListenerHandle, SystemBrowserOptions, WebViewOptions } from "./definitions";
import { DefaultSystemBrowserOptions, DefaultWebViewOptions } from "./defaults";
var exec = require('cordova/exec')

function openInWebView(url: string, options: WebViewOptions,  success: () => void, error: (error: PluginError) => void,  browserCallbacks?: BrowserCallbacks): void {
  options = options || DefaultWebViewOptions;
  console.log(`open in web view for url ${url}\n with options: ${JSON.stringify(options)}`);
  
  if(browserCallbacks)
    console.log(`with browser callbacks ${JSON.stringify(browserCallbacks)}`)

  exec(success, error, 'OSInAppBrowser', 'coolMethod', [{url, options, browserCallbacks}])
}

function openInSystemBrowser(url: string, options: SystemBrowserOptions, success: () => void, error: (error: PluginError) => void, browserCallbacks?: BrowserCallbacks): void {
  options = options || DefaultSystemBrowserOptions;
  console.log(`open in system browser view for url ${url}\n with options: ${JSON.stringify(options)}`);
  if(browserCallbacks)
    console.log(`with browser callbacks ${JSON.stringify(browserCallbacks)}`)
  
  exec(success, error, 'OSInAppBrowser', 'coolMethod', [{url, options, browserCallbacks}])  
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