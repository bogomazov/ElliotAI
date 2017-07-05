# Elliot | React Native
1. `git clone https://github.com/elliottech/elliot-mobile`
2. Check that Android SDK is installed as well as `adb` mentioned within `$PATH`
3. Install react native globally with: `npm install -g react-native-cli`
4. Install requirements with: `npm install`
5. Check `js/settings.js` for `IS_DEV=true` if you are in the development mode (points to `staging` server).<br/>
6. Go to `node_modules/react-native-fbsdk/android/build.gradle` and change the last compile to `compile('com.facebook.android:facebook-android-sdk:4.22.1')` (will be removed once facebook resolves the issue)

# Run:
1. Create the device with Play Store pre-installed
2. `react-native run-android` with an emulator/device connected.

# Elliot-iOS | React Native

## Running on simulator
1. Clone the repository.
2. `open ios/Elliot.xcworkspace`, don't convert Swift syntax, choose "later" and "no". This step lets Xcode register a scheme for react-native-cli to use, automatically. You can now close Xcode.
3. Run `npm install` inside the directory where `package.json` exists.
4. `npm run build-ios-dev`
5. `npm start`
6. `react-native run-ios`

## Running on a device (on dev-merge only)
1. Run `npm install` to make sure your local packages are up to date.
2. Connect the device and run the app via Xcode in the same way.
3. Codepush will automatically fetch the latest JS code (staging for builds with `DEBUG` scheme and prod for `RELEASE`).

# Codepush Deployment
1. Install code-push cli: `npm install -g code-push-cli`
2. Make sure you have access to the previously added code-push app.
3. `sh deploy.sh <environment> <unique-app-name> <platform>`
    - `<environment>` should be either `Staging` or `Production`.
    - `platform` should be either `ios` or `android`.
 
Android:<br/>
`sh deploy.sh Staging elliot android`<br/>
`sh deploy.sh Production elliot android`<br/>

iOS:<br/>
`sh deploy.sh Staging Elliot-iOS ios`<br/>
`sh deploy.sh Production Elliot-iOS ios`<br/>

# Build Android apk

1. Open `android/app/build.gradle`
2. Change 
```
defaultConfig {
    ...
    versionCode 18 <-- to higher version then whatever is currently in PlayStore
    versionName "1.0.7" <- also needs to be updated. Used by code-push. (Play store allows to publish the same versionName but versionCode is an ultimate identifier of the release version)
    ...
}
```

3. Make sure `IS_DEV=true` for Staging Server and `IS_DEV=false` for Prod Server in `settings.js`
4. cd `android`
5. `./gradlew assembleRelease` or `./gradlew assembleReleaseStaging` for Production vs Staging CodePush

Find apk in: `android/app/build/outputs/apk/`

Check build by:
 - `react-native run-android --variant=release` 
 - `react-native run-android --variant=releaseStaging`
 - dragging and dropping an apk from `android/app/build/outputs/apk/` to an emulator
 

# Potential Errors

## EMFILE

If you see an error that looks like this:
```
Error watching file for changes: EMFILE
{"code":"EMFILE","errno":"EMFILE","syscall":"Error watching file for changes:","filename":null}
Error: Error watching file for changes: EMFILE
```

It can be resolved by running the following commands (reinstall Watchman):

```
brew uninstall watchman
brew link automake
brew install --HEAD watchman
```

See https://github.com/facebook/react-native/issues/910 for more information.

## XCode Command Line Tools

If you see an error that looks like this:
```
Command failed: xcrun instruments -s
xcrun: error: unable to find utility "instruments", not a developer 
tool or in PATH
```

XCode command line tools may not been installed yet, you will need to run `xcode-select --install`

To make sure XCode picks the right tool version, run `sudo xcode-select -s /Applications/Xcode.app`

See https://stackoverflow.com/questions/39778607/error-running-react-native-app-from-terminal-ios for more information.


 



