# Elliot | React Native
1. `git clone https://github.com/elliottech/elliot-android` <br/>
2. Check that Android SDK is installed as well as `adb` mentioned within `$PATH` <br/>
3. `npm install` <br/>
4. Check `js/settings.js` for `IS_DEV=true` if you are in the development mode (points to `staging` server).<br/>
5. Go to `node_modules/react-native-fbsdk/android/build.gradle` and change the last compile to `compile('com.facebook.android:facebook-android-sdk:4.22.1')` (will be removed once facebook resolves the issue) <br/>
# Run: <br/>
`react-native run-android` with an emulator/device connected. <br/>
