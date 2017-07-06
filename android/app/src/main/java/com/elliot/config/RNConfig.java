package com.elliot.config;

import android.support.annotation.Nullable;

import com.elliot.BuildConfig;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by andrey on 2017-07-06.
 */

public class RNConfig extends ReactContextBaseJavaModule {
    public RNConfig(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return "Config";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("buildEnvironment", BuildConfig.BUILD_ENV);
        return constants;
    }
}