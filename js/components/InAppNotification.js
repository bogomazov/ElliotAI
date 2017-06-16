import {IS_IOS} from '../settings.js';
import s, {themeColorThird} from '../res/values/styles.js';
import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default InAppNotification = ({title, message}) => {
  const topMargin = IS_IOS ? {marginTop: -20} : {};
  return <View style={[topMargin, s.padding10, {backgroundColor: themeColorThird}]}>
    <Text style={[s.textColorWhite, s.bold]}>{title}</Text>
    <Text style={[s.textColorWhite]}>{message}</Text>
  </View>
}
