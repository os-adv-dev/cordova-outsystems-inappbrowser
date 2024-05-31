package com.outsystems.plugins.inappbrowser.osinappbrowser

enum class OSInAppBrowserError(val code: Int, val message: String) {
    INPUT_ARGUMENTS_ISSUE(0, "The input parameters for 'openInExternalBrowser' are invalid."),
    OPEN_EXTERNAL_BROWSER_FAILED(0, "Couldn't open url using the external browser."),

    GOOGLE_SERVICES_RESOLVABLE_ERROR (200, "Google Play services aren't available on your device."),
    GOOGLE_SERVICES_ERROR (201, "Google Play Services error."),
}