# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# react-native-reanimated2
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

#Optional for proguard, you may use your own proguard configuration.
-dontusemixedcaseclassnames
-dontpreverify
-optimizationpasses 5
-keepparameternames
-renamesourcefileattribute SourceFile

#Mandatory for PGW SDK
#2C2P PGW Library
-dontwarn com.ccpp.my2c2psdk.**
-keep class com.ccpp.my2c2psdk.** { *; }
-keep interface com.ccpp.my2c2psdk.** { *; }

-keepclassmembers class **.R$* {
    public static <fields>;
}

#okhttp3
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-keepclassmembers class * extends javax.net.ssl.SSLSocketFactory {
    private final javax.net.ssl.SSLSocketFactory delegate;
}
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
-dontwarn org.codehaus.mojo.animal_sniffer.*
-dontwarn okhttp3.internal.platform.ConscryptPlatform

#Samsung Pay
-dontwarn com.samsung.**
-keep class com.samsung.** { *; }

#Spongy Castle
-dontwarn org.spongycastle.**
-keep class org.spongycastle.** { *; }

#AliPay
-dontwarn com.alipay.**
-dontwarn org.json.alipay.**
-keep class com.alipay.** { *; }
-keep class org.json.alipay.** { *; }
-keep class com.alipay.android.app.IAlixPay{*;}
-keep class com.alipay.android.app.IAlixPay$Stub{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback$Stub{*;}
-keep class com.alipay.sdk.app.PayTask{ public *;}
-keep class com.alipay.sdk.app.AuthTask{ public *;}
-keep class com.alipay.sdk.app.H5PayCallback {
    <fields>;
    <methods>;
}
-keep class com.alipay.android.phone.mrpc.core.** { *; }
-keep class com.alipay.apmobilesecuritysdk.** { *; }
-keep class com.alipay.mobile.framework.service.annotation.** { *; }
-keep class com.alipay.mobilesecuritysdk.face.** { *; }
-keep class com.alipay.tscenter.biz.rpc.** { *; }
-keep class org.json.alipay.** { *; }
-keep class com.alipay.tscenter.** { *; }
-keep class com.ta.utdid2.** { *;}
-keep class com.ut.device.** { *;}
-dontwarn com.ta.utdid2.**
-dontwarn com.ut.device.**
-dontwarn com.alipay.mobilesecuritysdk.**
-dontwarn com.alipay.security.**