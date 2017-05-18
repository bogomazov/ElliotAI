import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, Linking, TextInput, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import SuggestionCard from '../components/SuggestionCard'
import IntroLabel from '../components/IntroLabel'
import CatchUpCard from '../components/CatchUpCard'
import CustomButton from '../components/CustomButton'
import strings from '../res/values/strings'
import s, {themeColor} from '../res/values/styles'
import PhoneNumber from '../utils/PhoneNumberModule'

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PhoneVerificationScene extends Component {
  state = {
    phoneNumber: '',
    isSent: false
  }
	componentWillMount = () => {
		console.log(this.props)
		PhoneNumber.getPhoneNumber().then((phoneNumber) => this.setState({phoneNumber}))
	}

  _onVerifyPressed = () => {
    const token = getRandomArbitrary(1000, 9999)
    console.log(token)
    this.props.setPhoneVerificationCode(token)
    this.props.appActions.sendPhoneNumber(this.state.phoneNumber, token).then((response) => {
      this.setState({isSent: true})
    })
    // setPhoneVerificationCode
  }

  render() {
		console.log(this.props)

    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../res/images/Icon-40@2x.png')}/>
        <Text style={[s.textAlignCenter, s.light, s.textColorTheme]}>{strings.phoneIntro}</Text>
        <TextInput
          style={styles.textInput}
          underlineColorAndroid='#000'
          selectionColor='#000'
          onChangeText={(phoneNumber) => this.setState({phoneNumber})}
          value={this.state.phoneNumber}></TextInput>

        {this.state.isSent && <Text style={[s.textAlignCenter, s.bold, s.textColorTheme]}>We have sent you sms, once you receive it - go through the link to start using Elliot!</Text>}
        {!this.state.isSent && <Button
            onPress={this._onVerifyPressed}
            title="VERIFY"
            color={themeColor}
          />}


        <Text style={[s.light, s.textColorTheme, s.textAlignCenter]}>{strings.phoneDisclaimer}</Text>
      </View>
    );
  }
}

{/* <Button
    onPress={() => Linking.openURL('elliot://actions/phone-verification/34')}
    title="Open elliot://actions/phone-verification"
  />
  <Button
    onPress={() => Linking.openURL('example://test/23')}
    title="Open example://test/23"
  />
  <Button
    onPress={() => Linking.openURL('example://test/100/details')}
    title="Open example://test/100/details"
  /> */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 25
  },

  image: {
    height: 100,
    width: 100
  },

  textInput: {
    height: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    textAlign: 'center',
    color: 'black',
    // borderColor: 'white',
    // borderWidth: 1,
    // borderRadius: 50
  },

  button: {
    // height: 50,
    width: 300,
    alignSelf: 'stretch',
  },

  topBarIcon: {
    height: 40,
    width: 40
  }
});
