package com.outsystems.plugins.inappbrowser;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class echoes a string called from JavaScript.
 */
class OSInAppBrowser: CordovaImplementation() {

    override fun execute(
        action: String,
        args: JSONArray,
        callbackContext: CallbackContext
    ): Boolean {
        this.callbackContext = callbackContext
        val result = runBlocking {
            when (action) {
                "coolMethod" -> {
                   //TODO
                   return true
                }

                else -> return false
            }
            true
        }
        return result
    }
}
