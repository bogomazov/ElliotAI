package com.elliot;

import android.app.Application;

import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.elliot.calendarevents.CalendarEventsPackage;
import com.elliot.config.RNConfig;
import com.elliot.config.RNConfigPackage;
import com.elliot.location.LocationReactPackage;
import com.elliot.phonenumber.PhoneNumberReactPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;

public class MainApplication extends Application implements ReactApplication {

  // 2. Override the getJSBundleFile method in order to let
  // the CodePush runtime determine where to get the JS
  // bundle location from on each app start

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGoogleSigninPackage(),
            new RNDeviceInfo(),
              new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG),
            new VectorIconsPackage(),
          new ReactNativeContacts(),
          new FBSDKPackage(mCallbackManager),
          new CalendarEventsPackage(),
          new ReactNativeLocalizationPackage(),
          new LocationServicesDialogBoxPackage(),
          new ReactNativePermissionsPackage(),
          new LocationReactPackage(),
          new RNSharePackage(),
          new PhoneNumberReactPackage(),
          new RNConfigPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.setApplicationId("1591073697851633");
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);

    SoLoader.init(this, /* native exopackage */ false);
  }
}
