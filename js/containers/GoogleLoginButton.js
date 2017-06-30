import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import React, {Component} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as appActions from '../state/actions/app';

GoogleSignin.configure({
   scopes: ["https://www.googleapis.com/auth/calendar"], // what API you want to access on behalf of the user, default is email and profile
   iosClientId: "245808737532-gpqc29f2ifmvqprmetmmtr60gaoq0cfg.apps.googleusercontent.com", // only for iOS
   webClientId: "245808737532-ch1af9npbnnrova04gi752au3j74agia.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
   offlineAccess: true // if you want to access Google API on behalf of the user FROM YOUR SERVER
})

const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class GoogleLoginButton extends Component {

  _googleSignIn = () => {

		GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      console.log('has play services');
			console.log('signing in');
			GoogleSignin.signIn()
				.then((user) => {
				  console.log(user);
          this.props.appActions.sendGoogleAuthToken(user.serverAuthCode)
          this.props.onLogin(user);
          // Log out from this account to allow subsequent logins.
          GoogleSignin.signOut();
				})
				.catch((err) => {
				  console.log('WRONG SIGNIN', err);
        })
				.done();
		})
		.catch((err) => {
		  console.log("Play services error", err.code, err.message);
    })
	}

  render() {
    console.log(this.props)
    return (
      <GoogleSigninButton
        style={{width: 212, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={this._googleSignIn}
      />
    );
  }
}
