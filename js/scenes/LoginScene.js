import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { View, StyleSheet, Text } from 'react-native';
import React, { Component } from 'react'
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {connectToApp} from '../utils/ReduxConnect';
import {IS_IOS} from '../settings'
import IntroSwipe from '../containers/Intro'
import s from '../res/values/styles';

@connectToApp
export default class LoginScene extends Component {

  state = {
    toShowLoginButton: true
  }
  onLoginFinished = (error, result) => {
    if (error) {
      alert("Login failed with error: " + result.error);
    } else if (result.isCancelled) {
      // alert("Login was cancelled");
    } else {
      this.setState({toShowLoginButton: false})
      console.log(result)
      // alert("Login was successful with permissions: " + result.grantedPermissions)
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          // alert(data.accessToken.toString())
          this.props.appActions.sendSocialMediaAccessToken(data.accessToken.toString(), SOCIAL_MEDIA_FB)
        }
      )
    }
  }

  render() {

    return (
      <View style={styles.container}>
        <Text style={s.nuxElliotHeader}>Elliot</Text>
        <IntroSwipe/>
        <View style={styles.loginButtonWrapper}>
          {this.state.toShowLoginButton && <LoginButton
            style={IS_IOS? styles.loginButton: undefined}
            readPermissions={["email","public_profile","user_friends"]}
            onLoginFinished={this.onLoginFinished}
            onLogoutFinished={() => alert("User logged out")}/>}
          {!this.state.toShowLoginButton && <Text>Loading...</Text>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loginButtonWrapper: {
    paddingBottom: 30,
  },
  loginButton: {
    width: 200,
    height: 50,
  }
});
