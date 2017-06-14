import { Platform } from 'react-native'

export const IS_DEV = true
export const APP_VERSION = '1.0.6'
export const IS_IOS = Platform.OS == 'ios'
export const IS_ANDROID = Platform.OS == 'android'
export const IS_TEST_SUGGESTIONS = false
export const IS_REDUX_LOGGER_ENABLED = true
