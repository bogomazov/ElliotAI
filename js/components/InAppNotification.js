import {IS_IOS} from '../settings.js';
import s, {themeColorThird} from '../res/values/styles.js';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Notification from 'react-native-in-app-notification'

const notificationBodyComponent = ({title, message}) => <View style={[s.padding10, {backgroundColor: themeColorThird}, IS_IOS ? {marginTop: -20} : null]}>
  <Text style={[s.textColorWhite, s.bold]}>{title}</Text>
  <Text style={[s.textColorWhite]}>{message}</Text>
</View>

export default class InAppNotification extends Component {
  show = (title, description) => {
    this.notification.show(
      title,
      description
    );
  }

  render = () => <Notification ref={(ref) => { this.notification = ref; }}
      notificationBodyComponent={notificationBodyComponent}
      height={60} />
}
