/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Linking, Button, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LoginScene from './LoginScene'
import * as appActions from '../state/actions/app';
import PermissionsScene from './PermissionsScene'
import SplashScene from './SplashScene'
import RNCalendarEvents from 'react-native-calendar-events';
import Contacts from 'react-native-contacts'
import { LoginManager } from 'react-native-fbsdk'
import { mainBackgroundColor } from '../res/values/styles'
import BottomNav from '../containers/BottomNavigation'
import SuggestionsScene from '../scenes/SuggestionsScene'
import InviteFriendsScene from '../scenes/InviteFriendsScene'
import CalendarScene from '../scenes/CalendarScene'
import PhoneVerificationScene from '../scenes/PhoneVerificationScene'
import DeepLinking from 'react-native-deep-linking'
import {IS_DEV} from '../index'

export const MAIN_TAB = 0
export const CALENDAR_TAB = 1
export const INVITE_FRIENDS_TAB = 2

const weekly = 0
const friendJoined = 1
const confirmed = 2
const reschedule = 3
const update = 4
const openInvite = 5

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MainScene extends Component {

	state = {
		activeTab: 0,
		phoneVerificationCode: null
	}

	logUserOut = () => {
		this.props.appActions.logOut()
	}

	componentDidMount() {
		// console.log('Andreyyy')
		console.log('componentDidMount')
    DeepLinking.addScheme('https://');
    DeepLinking.addScheme('http://');
    DeepLinking.addScheme('elliot://');
    Linking.addEventListener('url', this._handleUrl);
		DeepLinking.addRoute('/phone-verification/:code', (response) => {
      // example://test
			console.log(response)
			if (this.state.phoneVerificationCode == response.code) {
				this.props.appActions.phoneVerified()
			}
    });
		DeepLinking.addRoute('/open-tab/:code', (response) => {
      // example://test/23
      console.log(response)
      switch (parseInt(response.code)) {
        case weekly:
        case friendJoined:
        case reschedule:
        case update:
	        this._switchTab(MAIN_TAB)
	        break;
				case openInvite:
					this._switchTab(INVITE_FRIENDS_TAB)
					break;
				case confirmed:
					this._switchTab(CALENDAR_TAB)
					break;
      }
    });



		// Linking.getInitialURL().then((url) => {
    //   if (url) {
    //     Linking.openURL(url);
    //   }
    // }).catch(err => console.error('An error occurred', err));

	}

	componentWillUnmount() {
    Linking.removeEventListener('url', this._handleUrl);
  }

	_setPhoneVerificationCode = (code) => this.setState({phoneVerificationCode: code})

	_handleUrl = ({ url }) => {
		console.log(url)
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }

  _switchTab = (sceneId) => {
    this.setState({activeTab: sceneId})
  }



  render() {
		console.log(this.props)
		// this.props.appActions.newAccessToken('new one')

			if (!this.props.app.isRehydrated ||
        (this.props.app.isLoggedIn && this.props.app.isPermissionsGranted && !this.props.app.isLocationGiven)) {
				return <SplashScene />
			}

			if (!this.props.app.isLoggedIn) {
				return <LoginScene/>
			}

			if (!this.props.app.isPermissionsGranted) {
				return <PermissionsScene/>
			}

			if (!IS_DEV && !this.props.app.isPhoneNumberVerified) {
				return <PhoneVerificationScene setPhoneVerificationCode={this._setPhoneVerificationCode}/>
			}





			return (<View style={styles.container}>
				{/* <Button
          onPress={this.logUserOut}
          title="Log out"
          color="#841584"
        /> */}
        <BottomNav
					navigation={this.props.navigation}
					activeTab={this.state.activeTab}
					onTabSelect={this._switchTab}>
          <SuggestionsScene
            iconActive={require('../res/images/home_active_1.5-66px.png')}
            icon={require('../res/images/home_gray-66px.png')}/>
          <CalendarScene
            iconActive={require('../res/images/calendar_active_1.5-66px.png')}
            icon={require('../res/images/calenar_grey-66px.png')}/>
          <InviteFriendsScene
            iconActive={require('../res/images/invite_active.png')}
            icon={require('../res/images/invite_grey.png')}/>

        </BottomNav>
      </View>);

  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor
  },
});
