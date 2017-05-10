/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Button, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LoginScene from './LoginScene'
import * as appActions from '../state/actions/app';
import PermissionsScene from './PermissionsScene'
import SplashScene from './SplashScene'
import RNCalendarEvents from 'react-native-calendar-events';
import Contacts from 'react-native-contacts'
import { LoginManager } from 'react-native-fbsdk'
import BottomNav from '../containers/BottomNavigation'
import SuggestionsScene from '../scenes/SuggestionsScene'
import InviteFriendsScene from '../scenes/InviteFriendsScene'

import { setCustomText } from 'react-native-global-props';

export const INVITE_FRIENDS_TAB = 2

const customTextProps = {
  style: {
    fontFamily: 'OpenSans-Regular'
  }
}
setCustomText(customTextProps);


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



	logUserOut = () => {
		LoginManager.logOut()
		this.props.appActions.logOut()
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

			return (<View style={styles.container}>
				<Button
          onPress={this.logUserOut}
          title="Log out"
          color="#841584"
        />
        <BottomNav>
          <SuggestionsScene
            iconActive={require('../res/images/home_active_1.5-66px.png')}
            icon={require('../res/images/home_gray-66px.png')}/>
          <SuggestionsScene
            iconActive={require('../res/images/calendar_active_1.5-66px.png')}
            icon={require('../res/images/calenar_grey-66px.png')}/>
          <InviteFriendsScene
            iconActive={require('../res/images/invite_active.png')}
            icon={require('../res/images/invite_grey.png')}/>

        </BottomNav>
      </View>);

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

});
