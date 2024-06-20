package com.outsystems.plugins.inappbrowser.osinappbrowser

import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.gson.Gson
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.OSIABEngine
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.OSIABEventListener
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABToolbarPosition
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABWebViewOptions
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.routeradapters.OSIABExternalBrowserRouterAdapter
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.routeradapters.OSIABWebViewRouterAdapter
import com.outsystems.plugins.oscordova.CordovaImplementation
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaInterface
import org.apache.cordova.CordovaWebView
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONObject

class OSInAppBrowser: CordovaImplementation() {
    override var callbackContext: CallbackContext? = null
    private var engine: OSIABEngine? = null
    private val gson by lazy { Gson() }

    private var callbackContexts: MutableMap<String, CallbackContext> = mutableMapOf()

    /**
     * Sets a listener for the browser events
     */
    private val eventListener = object : OSIABEventListener {
        override fun onBrowserFinished(callbackID: String?) {
            callbackID?.let {
                sendSuccess(callbackID, OSIABEventType.BROWSER_FINISHED)
            }
        }

        override fun onBrowserPageLoaded(callbackID: String?) {
            callbackID?.let {
                sendSuccess(callbackID, OSIABEventType.BROWSER_PAGE_LOADED)
            }
        }
    }

    override fun initialize(cordova: CordovaInterface, webView: CordovaWebView) {
        super.initialize(cordova, webView)
        val externalBrowserRouter = OSIABExternalBrowserRouterAdapter(cordova.context)
        val webViewRouter = OSIABWebViewRouterAdapter(cordova.context, eventListener)
        this.engine = OSIABEngine(externalBrowserRouter, webViewRouter)
    }

    override fun execute(
        action: String,
        args: JSONArray,
        callbackContext: CallbackContext
    ): Boolean {
        this.callbackContext = callbackContext
        val callbackID = callbackContext.callbackId
        callbackContexts[callbackID] = callbackContext

        when(action) {
            "openInExternalBrowser" -> {
                openInExternalBrowser(args)
            }
            "openInWebView" -> {
                openInWebView(args, callbackID)
            }
        }
        return true
    }

    /**
     * Calls the openExternalBrowser method of OSIABEngine to open the url in the device's browser app
     * @param args JSONArray that contains the parameters to parse (e.g. url to open)
     */
    private fun openInExternalBrowser(args: JSONArray) {
        try {
            val argumentsDictionary = args.getJSONObject(0)
            val url = argumentsDictionary.getString("url")

            engine?.openExternalBrowser(url) { success ->
                if (success) {
                    sendPluginResult("success", null)
                } else {
                    sendPluginResult(
                        null,
                        OSInAppBrowserError.OPEN_EXTERNAL_BROWSER_FAILED.toPair()
                    )
                }
            }
        }
        catch (e: Exception) {
            sendPluginResult(null, OSInAppBrowserError.INPUT_ARGUMENTS_ISSUE.toPair())
        }
    }

    /**
     * Calls the openWebView method of OSIABEngine to open the url in a WebView
     * @param args JSONArray that contains the parameters to parse (e.g. url to open)
     */
    private fun openInWebView(args: JSONArray, callbackID: String) {
        try {
            val arguments = args.getJSONObject(0)
            val url = arguments.getString("url")
            val webViewOptions = buildWebViewOptions(arguments.getString("options"))

            engine?.openWebView(url, webViewOptions, callbackID) { success ->
                if (success) {
                    sendSuccess(callbackID, OSIABEventType.SUCCESS)
                } else {
                    sendError(callbackID, OSInAppBrowserError.OPEN_WEB_VIEW_FAILED)
                }
            }
        }
        catch (e: Exception) {
            sendError(callbackID, OSInAppBrowserError.INPUT_ARGUMENTS_WEB_VIEW_ISSUE)
        }
    }

    override fun onResume(multitasking: Boolean) {
        // Do nothing
    }

    override fun areGooglePlayServicesAvailable(): Boolean {
        val googleApiAvailability = GoogleApiAvailability.getInstance()
        val status = googleApiAvailability.isGooglePlayServicesAvailable(getActivity())

        if (status != ConnectionResult.SUCCESS) {
            val result: Pair<String, String> = if (googleApiAvailability.isUserResolvableError(status)) {
                googleApiAvailability.getErrorDialog(getActivity(), status, 1)?.show()
                OSInAppBrowserError.GOOGLE_SERVICES_RESOLVABLE_ERROR.toPair()
            } else {
                OSInAppBrowserError.GOOGLE_SERVICES_ERROR.toPair()
            }
            sendPluginResult(null, result)
            return false
        }
        return true
    }

    /**
     * Parses options that come in JSON to a 'OSInAppBrowserWebViewInputArguments'.
     * Then, it uses the newly created object to create a 'OSIABWebViewOptions' object.
     * @param options The options to open the URL in a WebView, in a JSON string.
     */
    private fun buildWebViewOptions(options: String): OSIABWebViewOptions {
        return gson.fromJson(options, OSInAppBrowserWebViewInputArguments::class.java).let {
            OSIABWebViewOptions(
                it.showURL ?: true,
                it.showToolbar ?: true,
                it.clearCache ?: true,
                it.clearSessionCache ?: true,
                it.mediaPlaybackRequiresUserAction ?: false,
                it.closeButtonText ?: "Close",
                it.toolbarPosition ?: OSIABToolbarPosition.TOP,
                it.leftToRight ?: false,
                it.showNavigationButtons ?: true,
                it.android.allowZoom ?: true,
                it.android.hardwareBack ?: true,
                it.android.pauseMedia ?: true
            )
        }
    }

    /**
     * Helper method to send a success result
     * @param callbackID CallbackID for the CallbackContext to send the result to
     * @param event Event to be sent (SUCCESS, BROWSER_PAGE_LOADED, or BROWSER_FINISHED)
     */
    private fun sendSuccess(callbackID: String, event: OSIABEventType) {
        val pluginResult = PluginResult(PluginResult.Status.OK, event.value)
        pluginResult.keepCallback = true
        callbackContexts[callbackID]?.sendPluginResult(pluginResult)
    }

    /**
     * Helper method to send an error result
     * @param callbackID CallbackID for the CallbackContext to send the result to
     * @param error Error to be sent in the result
     */
    private fun sendError(callbackID: String, error: OSInAppBrowserError) {
        val pluginResult = PluginResult(
            PluginResult.Status.ERROR,
            JSONObject().apply {
                put("code", error.code)
                put("message", error.message)
            }
        )
        callbackContexts[callbackID]?.sendPluginResult(pluginResult)
    }

}

enum class OSIABEventType(val value: Int) {
    SUCCESS(1),
    BROWSER_FINISHED(2),
    BROWSER_PAGE_LOADED(3)
}
