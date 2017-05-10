'use strict';
/**
 * checkLocationAccess()
 * returns Promise
 */
import { NativeModules } from 'react-native';
console.log(NativeModules.LocationAccess)
module.exports = NativeModules.LocationAccess;
