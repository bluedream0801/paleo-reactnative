package com.paleorobbie;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import java.util.Map;
import java.util.HashMap;
import android.util.Log;
import android.app.Activity;
import android.content.Intent;
import com.ccpp.my2c2psdk.cores.My2c2pSDK;
import com.ccpp.my2c2psdk.cores.My3DSActivity;
import com.ccpp.my2c2psdk.cores.My2c2pResponse;


public class My2c2pModule extends ReactContextBaseJavaModule {
    private static final int REQUEST_SDK = 1;
    private My2c2pSDK sdk;
    private Promise promise;
    private static final String TAG = "My2c2pModule";
    private final ReactApplicationContext reactContext;


    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == REQUEST_SDK) {
                if (data != null) {
                    Log.d(TAG, "result code: " + resultCode);

                    My2c2pResponse response = data.getExtras().getParcelable(My2c2pResponse.RESPONSE);
                    if (response != null) {
                        if (response.getRespCode().equals("301")) {
                            Log.d(TAG, "transaction canceled" + resultCode);
                            promise.reject("TRANSACTION_CANCELED", "Transaction is canceled");
                            return;
                        }
                        Log.d(TAG, "response" + response.toString());
                        WritableMap result = Arguments.createMap();
                        result.putString("version", response.getVersion());
                        result.putString("timeStamp", response.getTimeStamp());
                        result.putString("merchantID", response.getMerchantID());
                        result.putString("respCode", response.getRespCode());
                        result.putString("pan", response.getPan());
                        result.putString("amount", response.getAmount());
                        result.putString("uniqueTransactionCode", response.getUniqueTransactionCode());
                        result.putString("tranRef", response.getTranRef());
                        result.putString("approvalCode", response.getApprovalCode());
                        result.putString("refNumber", response.getRefNumber());
                        result.putString("dateTime", response.getDateTime());
                        result.putString("eci", response.getEci());
                        result.putString("status", response.getStatus());
                        result.putString("failReason", response.getFailReason());
                        result.putString("userDefined1", response.getUserDefined1());
                        result.putString("userDefined2", response.getUserDefined2());
                        result.putString("userDefined3", response.getUserDefined3());
                        result.putString("userDefined4", response.getUserDefined4());
                        result.putString("userDefined5", response.getUserDefined5());
                        result.putString("storeCardUniqueID", response.getStoreCardUniqueID());
                        result.putString("recurringUniqueID", response.getRecurringUniqueID());
                        result.putString("hashValue", response.getHashValue());
                        result.putString("ippPeriod", response.getIppPeriod());
                        result.putString("ippInterestType", response.getIppInterestType());
                        result.putString("ippInterestRate", response.getIppInterestRate());
                        result.putString("ippMerchantAbsorbRate", response.getIppMerchantAbsorbRate());
                        result.putString("paidChannel", response.getPaidChannel());
                        result.putString("paidAgent", response.getPaidAgent());
                        result.putString("paymentChannel", response.getPaymentChannel());
                        result.putString("backendInvoice", response.getBackendInvoice());
                        result.putString("issuerCountry", response.getIssuerCountry());
                        result.putString("bankName", response.getBankName());
                        result.putString("raw", response.getRaw());
                        promise.resolve(result);
                    } else {
                        promise.reject("NO_RESPONSE", "No response data");
                    }
                }
            }
        }
    };

    public My2c2pModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public String getName() {
        return "My2c2pModule";
    }

    @ReactMethod
    public void tokenizeCreditCard(ReadableMap params, Promise promise) {
        Log.d("My2c2pModule", "tokenizeCreditCard: " + params);
        this.promise=promise;
        String priv_key=params.getString("priv_key");
        Log.d("My2c2pModule", "priv_key: " + priv_key);
        sdk = new My2c2pSDK(priv_key);
        sdk.merchantID = params.getString("merchantID");
        sdk.secretKey=params.getString("secretKey");
        sdk.pan=params.getString("pan");
        sdk.cardExpireMonth=params.getString("cardExpireMonth");
        sdk.uniqueTransactionCode=params.getString("uniqueTransactionCode");
        sdk.cardExpireYear=params.getString("cardExpireYear");
        sdk.cardHolderName=params.getString("cardHolderName");
        sdk.tokenizeWithoutAuthorization=true;
        sdk.productionMode=true;
        sdk.paymentUI = false;
        sdk.panCountry="TH";
        sdk.request3DS="N";
        sendRequest();
    }

    @ReactMethod
    public void payCreditCard(ReadableMap params, Promise promise) {
        Log.d("My2c2pModule", "payCreditCard: " + params);
        this.promise=promise;
        String priv_key=params.getString("priv_key");
        Log.d("My2c2pModule", "priv_key: " + priv_key);
        sdk = new My2c2pSDK(priv_key);
        sdk.merchantID = params.getString("merchantID");
        sdk.secretKey=params.getString("secretKey");
        sdk.uniqueTransactionCode=params.getString("uniqueTransactionCode");
        sdk.amount=params.getDouble("amount");
        sdk.currencyCode=params.getString("currencyCode");
        sdk.desc=params.getString("desc");
        sdk.storedCardUniqueID=params.getString("storeCardUniqueID");
        sdk.securityCode=params.getString("securityCode");
        sdk.paymentUI = false;
        sdk.productionMode=true;
        sdk.panCountry="TH";
        sdk.request3DS="N";
        sendRequest();
    }

    private void sendRequest() {
        // execute the library using intent
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist");
            return;
        }
        sdk.proceed(currentActivity, REQUEST_SDK);
    }
}