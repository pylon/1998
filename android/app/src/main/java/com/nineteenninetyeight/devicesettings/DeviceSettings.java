package com.nineteenninetyeight.devicesettings;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.provider.Settings.Secure;
import android.os.Build;

import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nullable;


public class DeviceSettings extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public DeviceSettings(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DeviceSettings";
    }

    @Override
    public @Nullable Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<String, Object>();
        constants.put("voice_recognition_service", Secure.getString(this.reactContext.getContentResolver(), "voice_recognition_service"));
        constants.put("systemVersion", Build.VERSION.RELEASE);
        return constants;
    }

}
