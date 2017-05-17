import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, TextInput, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
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

@connect(mapStateToProps, mapDispatchToProps)
export default class PhoneVerificationScene extends Component {
  state = {
    phoneNumber: ''
  }
	componentWillMount = () => {
		console.log(this.props)
		PhoneNumber.getPhoneNumber().then((phoneNumber) => this.setState({phoneNumber}))
	}

  render() {
		console.log(this.props)

    return (
      <View style={styles.container}>
        <Text style={[s.textAlignCenter, s.bold, s.textColorWhite]}>Elliot need to know that you are a real person!</Text>

        <TextInput
          style={styles.textInput}
          underlineColorAndroid='#fff'
          selectionColor='#fff'
          onChangeText={(phoneNumber) => this.setState({phoneNumber})}
          value={this.state.phoneNumber}></TextInput>
        <CustomButton
          onPress={this.requestLocationPermissions}
          style={[styles.button]}
          title='VERIFY!'
          isWhite
        />
        <Text style={[s.textColorWhite]}>We will text you a confirmation message.</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: themeColor,
    padding: 25
  },

  textInput: {
    height: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    borderColor: 'white',
    borderWidth: 1
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
