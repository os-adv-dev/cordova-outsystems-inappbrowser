package com.outsystems.plugins.inappbrowser.osinappbrowser

enum class OSInAppBrowserError(val code: Int, val message: String) {
    INPUT_ARGUMENTS_ISSUE(100, "The input parameters for 'openInExternalBrowser' are invalid."),
    INPUT_ARGUMENTS_SYSTEM_BROWSER_ISSUE(101, "The input parameters for 'openInSystemBrowser' are invalid."),
    INPUT_ARGUMENTS_WEB_VIEW_ISSUE(102, "The input parameters for 'openInWebView' are invalid."),
    OPEN_EXTERNAL_BROWSER_FAILED(103, "Couldn't open {url} using the device's browser."),
    OPEN_SYSTEM_BROWSER_FAILED(104, "Couldn't open {url} using Custom Tabs."),
    OPEN_WEB_VIEW_FAILED(105, "Couldn't open {url} using the WebView.");

    fun getErrorMessage(url: String?): String {
        return url?.let {
            message.replace("{url}", url)
        } ?: message
    }

    fun formatErrorCode(): String {
        return "OS-PLUG-IABP-" + code.toString().padStart(4, '0')
    }

}