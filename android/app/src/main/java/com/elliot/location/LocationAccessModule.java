package com.elliot.location;

import android.app.Activity;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.AlertDialog;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.LocationSettingsStatusCodes;

/**
 * Created by andrey on 5/8/17.
 */

public class LocationAccessModule extends ReactContextBaseJavaModule implements ActivityEventListener, GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {

    private static final String TAG = "LocationAccessModule";
    private static final String SUCCESS = "success";
    private static final String FAIL_SETTING_CHANGE_UNAVAILABLE = "SETTING_CHANGE_UNAVAILABLE";
    private static final String FAIL_USER_CANCELED = "FAIL_USER_CANCELED";
    private static final int REQUEST_CHECK_SETTINGS = 777;

    private GoogleApiClient mGoogleApiClient;
    private Promise promise;

    public LocationAccessModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);



    }



    public void loadGoogleAPI() {
        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(getCurrentActivity())
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .addApi(LocationServices.API)
                    .build();
        }

//        Settings.getApplicationSignature(Context);

    }

    @Override
    public void onConnected(Bundle connectionHint) {
        Log.d(TAG, "onConnected");
    }

    @Override
    public void onConnectionSuspended(int i) {
        Log.d(TAG, "onConnectionSuspended");

    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        Log.d(TAG, "onConnectionFailed");
    }

    @Override
    public String getName() {
        return "LocationAccess";
    }


    private void promptToEnableLocationServices() {

        // Build the alert dialog
        AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
        builder.setTitle("High Accuracy Location Services Not Active");
        builder.setMessage("Please enable Location Services and GPS. Reachr uses accurate location to make it possible meet up with friends instantly!");
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialogInterface, int i) {
                // Show location settings when the user acknowledges the alert dialog
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                getCurrentActivity().startActivity(intent);
            }
        });
        Dialog alertDialog = builder.create();
        alertDialog.setCanceledOnTouchOutside(false);
        alertDialog.show();

    }

    @ReactMethod
    public void checkLocationAccess(Promise promise) {

        this.promise = promise;

        if (mGoogleApiClient == null) {
            loadGoogleAPI();
            Log.d("Connect", "true");
        }


        if (!mGoogleApiClient.isConnected()) {
            mGoogleApiClient.connect();
        }

        LocationRequest mLocationRequest = new LocationRequest();

        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(mLocationRequest);

        builder.setAlwaysShow(true);
//        Toast.makeText(getReactApplicationContext(), message, duration).show();
//        successCallback.invoke(true);
        PendingResult<LocationSettingsResult> result =
                LocationServices.SettingsApi.checkLocationSettings(mGoogleApiClient,
                        builder.build());
        setResultCallback(result);
    }


    private void setResultCallback(PendingResult<LocationSettingsResult> result) {
        Log.d("setResultCallback", "1");
        result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
            @Override
            public void onResult(LocationSettingsResult result) {
                final Status status = result.getStatus();

                final LocationSettingsStates locationSettingsStates = result.getLocationSettingsStates();
                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.SUCCESS:
                        // All location settings are satisfied. The client can
                        // initialize location requests here.
                        Log.d("LocationSettingsSat", "true");
                        promise.resolve(SUCCESS);

                        break;
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        Log.d("ResolutionRequired", "true");
                        // Location settings are not satisfied, but this can be fixed
                        // by showing the user a dialog.
                        try {
                            // Show the dialog by calling startResolutionForResult(),
                            // and check the result in onActivityResult().
                            status.startResolutionForResult(
                                    getCurrentActivity(),
                                    REQUEST_CHECK_SETTINGS);
                        } catch (IntentSender.SendIntentException e) {
                            // Ignore the error.
                            Log.e("Error", e.toString());
                        }
                        break;
                    case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                        // Location settings are not satisfied. However, we have no way
                        // to fix the settings so we won't show the dialog.
                        Log.d("SETTINGS_CHANGE_UNAVA", "true");
                        promise.reject(FAIL_SETTING_CHANGE_UNAVAILABLE, FAIL_SETTING_CHANGE_UNAVAILABLE);
                        break;
                }
            }
        });

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            // Check for the integer request code originally supplied to startResolutionForResult().
            case REQUEST_CHECK_SETTINGS:
                switch (resultCode) {
                    case Activity.RESULT_OK:
                        promise.resolve(SUCCESS);
                        break;
                    case Activity.RESULT_CANCELED:
                        promise.reject(FAIL_USER_CANCELED, FAIL_USER_CANCELED);
                        promptToEnableLocationServices();//keep asking if imp or do whatever
                        break;
                }
                break;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}