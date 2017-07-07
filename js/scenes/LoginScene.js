import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import IntroSwipe from '../containers/Intro'
import { themeColor } from '../res/values/styles'
import PhoneNumber from '../utils/PhoneNumberModule'

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
        <View style={styles.logoTextWrapper}>
          <Text style={styles.logoText}>Elliot</Text>
        </View>
        <IntroSwipe/>
        <View style={styles.loginButtonWrapper}>
          {this.state.toShowLoginButton && <LoginButton
            style={styles.loginButton}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  swiper: {
    // flex: 1,
    color: 'red',
    backgroundColor: 'red',
  },


  logoTextWrapper: {
		position: 'absolute',
		left: 0,
    right: 0,
		top: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
  },

	logoText: {
    // flex: 1,
		marginTop: 40,
		fontSize: 44,
    color: themeColor,
  },

  introWrapper: {

  },

  loginButtonWrapper: {
    height: 200
  },
});
