import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info';
import Config from './utils/ConfigModule'

const BUILD_ENV_DEV = 'DEBUG'
const BUILD_ENV_PROD = 'RELEASE'

export const IS_DEV = Config.buildEnvironment == BUILD_ENV_DEV
export const APP_VERSION = DeviceInfo.getVersion();
export const IS_IOS = Platform.OS == 'ios'
export const IS_ANDROID = Platform.OS == 'android'
export const IS_TEST_SUGGESTIONS = false
export const IS_REDUX_LOGGER_ENABLED = true
