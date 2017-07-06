import { Platform, NativeModules } from 'react-native'
import DeviceInfo from 'react-native-device-info';
import Config from './utils/ConfigModule'

<<<<<<< HEAD
const BUILD_ENV_STAGING = 'DEBUG'
const BUILD_ENV_PROD = 'RELEASE'

export const IS_DEV = Config.buildEnvironment == BUILD_ENV_STAGING
=======
console.log(NativeModules.Config);
export const IS_DEV = NativeModules.Config.buildEnvironment == 'DEBUG'
>>>>>>> d030bd7eb3f8217de80a534801559f910df6dec9
export const APP_VERSION = DeviceInfo.getVersion();
export const IS_IOS = Platform.OS == 'ios'
export const IS_ANDROID = Platform.OS == 'android'
export const IS_TEST_SUGGESTIONS = false
export const IS_REDUX_LOGGER_ENABLED = true
