package com.outsystems.plugins.inappbrowser.osinappbrowser

enum class OSInAppBrowserError(val code: Int, val message: String) {
    INPUT_ARGUMENTS_ISSUE(100, "The input parameters for 'openInExternalBrowser' are invalid."),
    INPUT_ARGUMENTS_WEB_VIEW_ISSUE(101, "The input parameters for 'openInWebView' are invalid."),
    OPEN_EXTERNAL_BROWSER_FAILED(102, "Couldn't open url using the external browser."),
    OPEN_WEB_VIEW_FAILED(103, "Couldn't open url using the WebView."),

    GOOGLE_SERVICES_RESOLVABLE_ERROR (200, "Google Play services aren't available on your device."),
    GOOGLE_SERVICES_ERROR (201, "Google Play Services error.");

    fun toPair(): Pair<String, String> {
        return Pair(code.toString(), message)
    }
}