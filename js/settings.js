import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info';

export const IS_DEV = true
export const APP_VERSION = DeviceInfo.getVersion();
export const IS_IOS = Platform.OS == 'ios'
export const IS_ANDROID = Platform.OS == 'android'
export const IS_TEST_SUGGESTIONS = false
