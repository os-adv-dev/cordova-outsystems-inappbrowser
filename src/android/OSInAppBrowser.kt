package com.outsystems.plugins.inappbrowser.osinappbrowser

import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.OSIABEngine
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABAnimation
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABBottomSheet
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABCustomTabsOptions
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABViewStyle
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.routeradapters.OSIABCustomTabsRouterAdapter
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.routeradapters.OSIABExternalBrowserRouterAdapter
import com.outsystems.plugins.oscordova.CordovaImplementation
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaInterface
import org.apache.cordova.CordovaWebView
import org.json.JSONArray
import org.json.JSONException

class OSInAppBrowser: CordovaImplementation() {
    override var callbackContext: CallbackContext? = null

    private var engine: OSIABEngine? = null

    override fun initialize(cordova: CordovaInterface, webView: CordovaWebView) {
        super.initialize(cordova, webView)
        val externalBrowserRouter = OSIABExternalBrowserRouterAdapter(cordova.context)
        val customTabsRouter = OSIABCustomTabsRouterAdapter(cordova.context)
        engine = OSIABEngine(externalBrowserRouter, customTabsRouter)
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
            "openInSystemBrowser" -> {
                openInSystemBrowser(args)
            }
        }

        return true
    }

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

    private fun openInSystemBrowser(args: JSONArray) {
        try {
            val argumentsDictionary = args.getJSONObject(0)
            val url = argumentsDictionary.getString("url")

            val optionsJson = try {
                argumentsDictionary.getJSONObject("options").getJSONObject("android")
            } catch (e: JSONException) {
                null
            }

            val options = optionsJson?.let {
                val showTitle = try {
                    it.getBoolean("showTitle")
                } catch(e: JSONException) {
                    true
                }

                val hideToolbarOnScroll = try {
                    it.getBoolean("hideToolbarOnScroll")
                } catch(e: JSONException) {
                    false
                }

                val viewStyle = try {
                    it.getInt("viewStyle").let { ordinal ->
                        OSIABViewStyle.entries[ordinal]
                    }
                } catch(e: JSONException) {
                    OSIABViewStyle.FULL_SCREEN
                }

                val bottomSheetOptions = try {
                    it.getJSONObject("bottomSheetOptions").let { json ->
                        val height = try {
                            json.getInt("height")
                        } catch(e: JSONException) {
                            1
                        }
                        val isFixed = try {
                            json.getBoolean("isFixed")
                        } catch(e: JSONException) {
                            false
                        }

                        OSIABBottomSheet(height, isFixed)
                    }
                } catch(e: JSONException) {
                    null
                }

                val startAnimation = try {
                    it.getInt("startAnimation").let { ordinal ->
                        OSIABAnimation.entries[ordinal]
                    }
                } catch(e: JSONException) {
                    OSIABAnimation.FADE_IN
                }

                val exitAnimation = try {
                    it.getInt("exitAnimation").let { ordinal ->
                        OSIABAnimation.entries[ordinal]
                    }
                } catch(e: JSONException) {
                    OSIABAnimation.FADE_OUT
                }

                OSIABCustomTabsOptions(
                    showTitle = showTitle,
                    hideToolbarOnScroll = hideToolbarOnScroll,
                    viewStyle = viewStyle,
                    bottomSheetOptions = bottomSheetOptions,
                    startAnimation = startAnimation,
                    exitAnimation = exitAnimation
                )
            }

            engine?.openCustomTabs(url, options) { success ->
                if (success) {
                    sendPluginResult("success", null)
                } else {
                    sendPluginResult(
                        null,
                        OSInAppBrowserError.OPEN_SYSTEM_BROWSER_FAILED.toPair()
                    )
                }
            }
        }
        catch (e: Exception) {
            sendPluginResult(null, OSInAppBrowserError.INPUT_ARGUMENTS_ISSUE.toPair())
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
}
