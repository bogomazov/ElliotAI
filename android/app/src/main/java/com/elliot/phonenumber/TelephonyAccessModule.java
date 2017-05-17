package com.elliot.phonenumber;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.telephony.TelephonyManager;
import android.util.Base64;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Created by andrey on 5/17/17.
 */

public class TelephonyAccessModule extends ReactContextBaseJavaModule {
    private static final String TAG = "TelephonyAccessModule";

    public TelephonyAccessModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void getPhoneNumber(Promise promise) {
        TelephonyManager t = (TelephonyManager) getReactApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        promise.resolve(t.getLine1Number());
    }

    @ReactMethod
    public void getKeyHash(Promise promise) {
        try {
            PackageInfo info = getReactApplicationContext().getPackageManager().getPackageInfo(
                    getReactApplicationContext().getPackageName(),
                    PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                promise.resolve(Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException e) {

        } catch (NoSuchAlgorithmException e) {

        }
    }



    @Override
    public String getName() {
        return "PhoneNumber";
    }

}
