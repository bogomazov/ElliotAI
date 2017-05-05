import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'


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
  onPressLearnMore = () => {
    this.props.appActions.newAccessToken('hey')
    // saveState()
  }
  render() {

    return (
      <View style={styles.container}>
				{/* <Text>Login!</Text> */}
        <Image
          style={{width: 100, height: 100}}
          source={require('../assets/images/Icon-40@3x.png')}/>
        {/* <Button
          onPress={this.onPressLearnMore}
          title="Learn More"
          color="#841584"
        /> */}
        <LoginButton
          style={styles.LoginButton}
          readPermissions={["email","public_profile","user_friends"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                console.log(result)
                alert("Login was successful with permissions: " + result.grantedPermissions)
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert(data.accessToken.toString())
                    this.props.appActions.sendSocialMediaAccessToken(data.accessToken.toString(), SOCIAL_MEDIA_FB)
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
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
  bottom_bar: {
    // width: 100%,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: 'gray',
    borderWidth: 1
  },
  loginButton: {

  }
});
