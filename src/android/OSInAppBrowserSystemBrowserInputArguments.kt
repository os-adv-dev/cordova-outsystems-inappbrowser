package com.outsystems.plugins.inappbrowser.osinappbrowser

import com.google.gson.annotations.SerializedName
import com.outsystems.plugins.inappbrowser.osinappbrowserlib.models.OSIABBottomSheet

data class OSInAppBrowserSystemBrowserInputArguments(
    @SerializedName("android") val android: OSInAppBrowserSystemBrowserAndroidOptions?
)

data class OSInAppBrowserSystemBrowserAndroidOptions(
    @SerializedName("showTitle") val showTitle: Boolean?,
    @SerializedName("hideToolbarOnScroll") val hideToolbarOnScroll: Boolean?,
    @SerializedName("viewStyle") val viewStyle: Int?,
    @SerializedName("bottomSheetOptions") val bottomSheetOptions: OSIABBottomSheet?,
    @SerializedName("startAnimation") val startAnimation: Int?,
    @SerializedName("exitAnimation") val exitAnimation: Int?,
)