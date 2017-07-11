import React, {Component} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as appActions from '../state/actions/app';
import {loginToGoogle} from '../utils/GoogleLogin';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

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
