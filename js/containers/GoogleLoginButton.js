import { GoogleSigninButton } from 'react-native-google-signin';
import React, {Component} from 'react';
import {loginToGoogle} from '../utils/GoogleLogin';

export default class GoogleLoginButton extends Component {

  googleSignIn = () => {
    loginToGoogle().then(user => {
      this.props.onLogin(user)
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    console.log(this.props)
    return (
      <GoogleSigninButton
        style={{width: 212, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={this.googleSignIn}
      />
    );
  }
}
