package com.outsystems.plugins.inappbrowser.osinappbrowser

enum class OSInAppBrowserError(val code: Int, val message: String) {
    INPUT_ARGUMENTS_EXTERNAL_BROWSER_ISSUE(100, "The 'openInExternalBrowser' input parameters aren't valid."),
    INPUT_ARGUMENTS_SYSTEM_BROWSER_ISSUE(101, "The 'openInSystemBrowser' input parameters aren't valid."),
    INPUT_ARGUMENTS_WEB_VIEW_ISSUE(102, "The 'openInWebView' input parameters aren't valid."),
    OPEN_EXTERNAL_BROWSER_FAILED(103, "External browser couldn't open the following URL: {url}"),
    OPEN_SYSTEM_BROWSER_FAILED(104, "Custom Tabs couldn't open the following URL: {url}"),
    OPEN_WEB_VIEW_FAILED(105, "The WebView couldn't open the following URL: {url}"),
    CLOSE_FAILED(106, "There’s no browser view to close.");

    fun getErrorMessage(url: String?): String {
        return url?.let {
            message.replace("{url}", url)
        } ?: message
    }

    fun formatErrorCode(): String {
        return "OS-PLUG-IABP-" + code.toString().padStart(4, '0')
    }

}