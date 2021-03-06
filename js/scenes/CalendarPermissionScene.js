import { View, Text } from 'react-native';
import React, {Component} from 'react';
import {connectToApp} from '../utils/ReduxConnect';
import GoogleLoginButton from '../containers/GoogleLoginButton';
import ProgressBar from '../components/ProgressBar';
import s, { permissionStyles as styles } from '../res/values/styles';
import strings from '../res/values/strings'

@connectToApp
export default class CalendarPermissionScene extends Component {
  state = {
    isGoogleSignInLoading: false
  }
  _onLogin = (googleUser) => {
    console.log(googleUser);
    this.setState({isGoogleSignInLoading: true})
    this.props.appActions.sendGoogleAuthToken(googleUser.serverAuthCode).then(() => {
      this.props.appActions.finishCalendarIntro()
    })
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={[s.nuxElliotHeader, {marginTop: 25}]}>Elliot</Text>
          <Text style={styles.description}> We need access to your calendars. This will tell us what times work for you.</Text>
        </View>
        <View style={[styles.middleWrapper, {flex: 1}]}>
          {!this.state.isGoogleSignInLoading?
            <GoogleLoginButton onLogin={this._onLogin} />
            :
            <ProgressBar />
          }
        </View>
        <Text style={styles.description}>{strings.disclaimer}</Text>
      </View>
    );
  }
}
