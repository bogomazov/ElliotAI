import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import React, {Component} from 'react';

GoogleSignin.configure({
   scopes: ["https://www.googleapis.com/auth/calendar.readonly"], // what API you want to access on behalf of the user, default is email and profile
   iosClientId: "112753570022-pvgppqdcq3ej00hj6jarphalsu1i1p3r.apps.googleusercontent.com", // only for iOS
   webClientId: "", // client ID of type WEB for your server (needed to verify user ID and offline access)
   offlineAccess: false // if you want to access Google API on behalf of the user FROM YOUR SERVER
})

export default class GoogleLoginButton extends Component {

  _googleSignIn = () => {
		GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      console.log('has play services');
			console.log('signing in');
			GoogleSignin.signIn()
				.then((user) => {
				  console.log(user);
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
