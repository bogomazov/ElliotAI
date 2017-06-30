import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import React, {Component} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as appActions from '../state/actions/app';

GoogleSignin.configure({
   scopes: ["https://www.googleapis.com/auth/calendar.readonly"], // what API you want to access on behalf of the user, default is email and profile
   iosClientId: "1019421776523-vnildr7d0d563p3egselo2v4d680h9m4.apps.googleusercontent.com", // only for iOS
   webClientId: "1019421776523-jmpbgvr1aciqmhq85hbgiv9ek0bkruhk.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
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

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
export default class GoogleLoginButton extends Component {

  googleSignIn = () => {

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
        style={this.props.isHidden? {position: 'absolute', width: 0, height: 0}: {width: 212, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={this.googleSignIn}
      />
    );
  }
}
