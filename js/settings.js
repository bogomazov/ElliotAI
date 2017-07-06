import { Platform, NativeModules } from 'react-native'
import DeviceInfo from 'react-native-device-info';

console.log(NativeModules.Config);
export const IS_DEV = NativeModules.Config.buildEnvironment == 'DEBUG'
export const APP_VERSION = DeviceInfo.getVersion();
export const IS_IOS = Platform.OS == 'ios'
export const IS_ANDROID = Platform.OS == 'android'
export const IS_TEST_SUGGESTIONS = false
export const IS_REDUX_LOGGER_ENABLED = true
