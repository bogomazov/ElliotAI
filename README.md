# Elliot | React Native
1. `git clone https://github.com/elliottech/elliot-android` <br/>
2. Check that Android SDK is installed as well as `adb` mentioned within `$PATH` <br/>
3. `npm install` <br/>
4. Check `js/settings.js` for `IS_DEV=true` if you are in the development mode (points to `staging` server).<br/>
5. Go to `node_modules/react-native-fbsdk/android/build.gradle` and change the last compile to `compile('com.facebook.android:facebook-android-sdk:4.22.1')` (will be removed once facebook resolves the issue) <br/>

# Run: <br/>
1. Create the device with Play Store pre-installed
2. `react-native run-android` with an emulator/device connected. <br/>

# Elliot-iOS | React Native

## Running on simulator
1. Clone the repository.
2. `open ios/Elliot.xcworkspace`, don't convert Swift syntax, choose "later" and "no". This step lets Xcode register a scheme for react-native-cli to use, automatically. You can now close Xcode.
3. Run `npm install` inside the directory where `package.json` exists.
4. `npm start`
5. `react-native run-ios`

## Running on a device (on dev-merge only)
1. Run `npm install` to make sure your local packages are up to date.
2. Connect the device and run the app via Xcode in the same way.
3. Codepush will automatically fetch the latest JS code (staging for builds with `DEBUG` scheme and prod for `RELEASE`).

# Codepush Deployment
1. Install code-push cli: `npm install -g code-push-cli`
2. Make sure you have access to the previously added code-push app.
3. `sh deploy.sh <environment> <unique-app-name> <platform>`
    - `<environment>` should be either `Staging` or `Production`.
    - `platform` should be either `ios` or `android`. <br/>
 
Android:<br/>
`sh deploy.sh Staging elliot android`<br/>
`sh deploy.sh Production elliot android`<br/>
