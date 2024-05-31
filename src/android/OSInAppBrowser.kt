package com.outsystems.plugins.inappbrowser.osinappbrowser

import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.OSIABEngine
import com.outsystems.plugins.oscordova.CordovaImplementation
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaInterface
import org.apache.cordova.CordovaWebView
import org.json.JSONArray

class OSInAppBrowser: CordovaImplementation() {
    override var callbackContext: CallbackContext? = null

    private var engine: OSIABEngine? = null

    override fun initialize(cordova: CordovaInterface, webView: CordovaWebView) {
        super.initialize(cordova, webView)
        val router = OSExternalBrowserRouterAdapter(cordova.context)
        this.engine = OSIABEngine(router)
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
        }

        return true
    }

    private fun openInExternalBrowser(args: JSONArray) {
        try {
            val argumentsDictionary = args.getJSONObject(0)
            val url = argumentsDictionary.getString("url")

            val success = engine?.openExternalBrowser(url) ?: false
            if (success) {
                sendPluginResult("success", null)
            } else {
                sendPluginResult(null, OSInAppBrowserError.OPEN_EXTERNAL_BROWSER_FAILED.toPair())
            }
        }
        catch (e: Exception) {
            sendPluginResult(null, OSInAppBrowserError.INPUT_ARGUMENTS_ISSUE.toPair())
        }
    }

    override fun onRequestPermissionResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        // Do nothing
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
}
