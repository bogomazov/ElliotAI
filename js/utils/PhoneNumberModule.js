'use strict';
/**
 * checkLocationAccess()
 * returns Promise
 */
import { NativeModules } from 'react-native';
console.log(NativeModules.PhoneNumber)
module.exports = NativeModules.PhoneNumber;
