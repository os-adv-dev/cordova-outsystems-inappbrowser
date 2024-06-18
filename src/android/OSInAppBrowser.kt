package com.outsystems.plugins.inappbrowser.osinappbrowser

import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.google.gson.Gson
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.OSIABEngine
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABToolbarPosition
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABWebViewOptions
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.routeradapters.OSIABExternalBrowserRouterAdapter
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.routeradapters.OSIABWebViewRouterAdapter
import com.outsystems.plugins.oscordova.CordovaImplementation
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaInterface
import org.apache.cordova.CordovaWebView
import org.json.JSONArray

class OSInAppBrowser: CordovaImplementation() {
    override var callbackContext: CallbackContext? = null
    private var engine: OSIABEngine? = null
    private val gson by lazy { Gson() }

    override fun initialize(cordova: CordovaInterface, webView: CordovaWebView) {
        super.initialize(cordova, webView)
        val externalBrowserRouter = OSIABExternalBrowserRouterAdapter(cordova.context)
        val webViewRouter = OSIABWebViewRouterAdapter(cordova.context)
        this.engine = OSIABEngine(externalBrowserRouter, webViewRouter)
    }

    override fun execute(
        action: String,
        args: JSONArray,
        callbackContext: CallbackContext
    ): Boolean {
        this.callbackContext = callbackContext

        when(action) {
            "openInExternalBrowser" -> {
                openInExternalBrowser(args)
            }
            "openInWebView" -> {
                openInWebView(args)
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
    private fun openInWebView(args: JSONArray) {
        try {
            val arguments = args.getJSONObject(0)
            val url = arguments.getString("url")

            val webViewOptions = buildWebViewOptions(arguments.getString("options"))
            if (webViewOptions == null) {
                sendPluginResult(null, OSInAppBrowserError.INPUT_ARGUMENTS_WEB_VIEW_ISSUE.toPair())
                return
            }

            engine?.openWebView(url, webViewOptions) { success ->
                if (success) {
                    sendPluginResult("success", null)
                } else {
                    sendPluginResult(
                        null,
                        OSInAppBrowserError.OPEN_WEB_VIEW_FAILED.toPair()
                    )
                }
            }
        }
        catch (e: Exception) {
            sendPluginResult(null, OSInAppBrowserError.INPUT_ARGUMENTS_WEB_VIEW_ISSUE.toPair())
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
    private fun buildWebViewOptions(options: String): OSIABWebViewOptions? {
        return try {
            gson.fromJson(options, OSInAppBrowserWebViewInputArguments::class.java).let {
                OSIABWebViewOptions(
                    it.showURL ?: true,
                    it.showToolbar ?: true,
                    it.clearCache ?: true,
                    it.clearSessionCache ?: true,
                    it.mediaPlaybackRequiresUserAction ?: false,
                    it.closeButtonText,
                    it.toolbarPosition ?: OSIABToolbarPosition.TOP,
                    it.leftToRight ?: false,
                    it.showNavigationButtons ?: true,
                    it.android.allowZoom ?: true,
                    it.android.hardwareBack ?: true,
                    it.android.pauseMedia ?: true
                )
            }
        } catch (e: Exception) {
            return null
        }
    }

}
