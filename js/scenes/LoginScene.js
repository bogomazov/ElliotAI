import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import IntroSwipe from '../containers/Intro'

const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}


@connect(mapStateToProps, mapDispatchToProps)
export default class LoginScene extends Component {

  onLoginFinished = (error, result) => {
    if (error) {
      alert("Login failed with error: " + result.error);
    } else if (result.isCancelled) {
      alert("Login was cancelled");
    } else {
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

  skipLogin = () => {
    this.props.appActions.newAccessToken('skip')
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.logoTextWrapper}>
          <Text style={styles.logoText}>Elliot</Text>
        </View>
        <View style={styles.introWrapper}>

          <Text style={styles.textStyle}>Elliot</Text>
        </View> */}
        <IntroSwipe/>
        <View style={styles.loginButtonWrapper}>
          <LoginButton
            style={styles.loginButton}
            readPermissions={["email","public_profile","user_friends"]}
            onLoginFinished={this.onLoginFinished}
            onLogoutFinished={() => alert("User logged out")}/>
            <Button
              onPress={this.skipLogin}
              title="Skip Login"
              color="#841584"
              style={{flex: 3}}
            />
            {/* <Text style={styles.logoText}>Elliot</Text> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  swiper: {
    // flex: 1,
    color: 'red',
    backgroundColor: 'red',
  },
  logoText: {
    flex: 1,
    color: '#000',
  },

  logoTextWrapper: {
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    flex: 0.2,
    // flex: 1,

    marginBottom: 40
  },

  textStyle: {
    flex: 1
  },

  introWrapper: {
    // flex: 0.2,

    // flex: 1,
    // height: 400
    // flexDirection: 'column',
    // justifyContent: 'flex-end',
  },

  loginButtonWrapper: {
    // paddingTop: 70,
    // flex: 0.2,

    height: 200
    // flex: 0.2,
    // flex: 1
  },

  // loginButton: {
  //   height: 20,
  //   width: 100
  // },

});
