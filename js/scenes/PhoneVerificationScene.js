import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { KeyboardAvoidingView, View, FlatList, Linking, TextInput, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
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
import {IS_ANDROID} from '../settings'

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
    if (IS_ANDROID) {
      PhoneNumber.getPhoneNumber().then((phoneNumber) => this.setState({phoneNumber}))
    }
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
        <View style={styles.wrapper}>
          <Text style={styles.elliotHeader}>Elliot</Text>
          <Text style={[s.textAlignCenter, s.light, styles.introText]}>{strings.phoneIntro}</Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              selectionColor='rgb(97, 97, 97)'
              onChangeText={(phoneNumber) => this.setState({phoneNumber})}
              value={this.state.phoneNumber}></TextInput>
          </View>
          {this.state.isSent && <Text style={[s.textAlignCenter, s.bold, s.textColorTheme]}>You will receive an SMS message that will have a link to continue so you can start using Elliot!</Text>}
        </View>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.wrapper}>
            {!this.state.isSent &&
              <CustomButton
                style={styles.verifyButton}
                onPress={this._onVerifyPressed}
                title="VERIFY"
                isFilled
              />
            }
            <Text style={[s.textAlignCenter, styles.disclaimer]}>{strings.phoneDisclaimer}</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'white',
    paddingHorizontal: 40,
  },

  wrapper: {
    justifyContent: 'flex-start',
  },

  image: {
    height: 100,
    width: 100
  },

  textInputWrapper: {
    marginTop: 30,
    borderBottomWidth: 2,
    borderColor: '#f1f2f1',
    borderStyle: 'solid',
  },

  textInput: {
    height: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    fontSize: 20,
    color: 'rgb(97, 97, 97)',
  },

  button: {
    width: 300,
    alignSelf: 'stretch',
  },

  topBarIcon: {
    height: 40,
    width: 40
  },

  elliotHeader: {
    textAlign: 'center',
    color: themeColor,
    fontSize: 32,
    marginTop: 40,
    fontFamily: 'OpenSans-ExtraBold'
  },

  introText: {
    textAlign: 'left',
    marginTop: 15,
    fontSize: 16,
    color: 'rgb(97, 97, 97)'
  },

  verifyButton: {
    color: 'white',
    backgroundColor: themeColor,
    alignSelf: 'stretch',
    borderRadius: 5,
    fontFamily: 'OpenSans-ExtraBold',
    padding: 10,
    marginTop: 30,
  },

  disclaimer: {
    marginVertical: 20,
    fontSize: 13,
    color: 'rgb(97, 97, 97)',
  }
});
