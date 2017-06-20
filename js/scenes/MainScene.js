/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import {
  AppRegistry,
  Linking,
  Button,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Navigator,
  ListView,
  Modal,
  Platform,
  NativeModules,
  AppState,
} from 'react-native';
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
import MeetingDetailsScene from '../scenes/MeetingDetailsScene'
import CalendarScene from '../scenes/CalendarScene'
import PhoneVerificationScene from '../scenes/PhoneVerificationScene'
import DeepLinking from 'react-native-deep-linking'
import {loadContacts} from '../utils/Contacts'
import {getEvents, checkCalendarPermissions} from '../utils/Calendar'
import LocationAccess from '../utils/LocationAccessModule'
import moment from 'moment'
import {StackNavigator} from 'react-navigation';
import {IS_DEV, IS_ANDROID, IS_IOS} from '../settings'

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
		phoneVerificationCode: null,
    appState: AppState.currentState
	}

  componentWillMount() {
    this._onResume();
  }

	componentDidMount() {
		console.log('componentDidMount')
    AppState.addEventListener('change', this._onAppStateChange)

    DeepLinking.addScheme('https://');
    DeepLinking.addScheme('http://');
    DeepLinking.addScheme('elliot://');
    Linking.addEventListener('url', this._handleUrl);
		DeepLinking.addRoute('/phone-verification/:code', (response) => {
			console.log(response)
			if (this.state.phoneVerificationCode == response.code) {
				this.props.appActions.phoneVerified()
			}
    });
		DeepLinking.addRoute('/open-tab/:code', (response) => {
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
	}

	componentWillUnmount() {
    Linking.removeEventListener('url', this._handleUrl);
    AppState.removeEventListener('change', this._onAppStateChange);
  }

  componentDidUpdate() {
    console.log('Did Update MainScene');
    console.log('isRehydrated:' + this.props.app.isRehydrated);
  }

  _onAppStateChange = (nextAppState) => {
  	const wasOnBackground = (this.state.appState === 'inactive' || this.state.appState === 'background');
  	if (wasOnBackground && nextAppState === 'active') {
      this._onResume();
    }
  	this.setState({appState: nextAppState});
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

  _onResume = () => {
    this._refreshFeed();
    this._loadScheduledMeetings();
    loadContacts();
  }

  _loadScheduledMeetings = () => {
    this.props.appActions.calendarLoading();
    if (IS_IOS && !this.props.app.didMigrateIOSCalendar) {
      NativeModules.CalendarMigration.getAllStored().then((dict) => {
        this.props.appActions.migrateIOSCalendar(dict);
        this.props.appActions.loadScheduledMeetings();
      });
      return;
    }
    this.props.appActions.loadScheduledMeetings().catch(error=>console.error(error))
  }

  _refreshFeed = () => {
    LocationAccess.checkLocationAccess().then((response) => {
      console.log(response)
      if (response == 'success') {
        LocationAccess.requestLocation().then((location) => {
          console.log(location)
          this.props.appActions.sendLocation(location.lng, location.lat, location.timestamp).then(data => {
            this.props.appActions.newLocation(location.lng, location.lat, location.timestamp)
            this._updateCalendarEvents()
          })
        })
      }
    }).catch((error) => {
      console.log(error)
      // On iOS location permission is optional.
      // So if access hasn't been granted, move on with calendar events.
      if (IS_IOS) {
        this._updateCalendarEvents()
      }
    })
  }

	_updateCalendarEvents = () => {
    console.log('getting events')
    checkCalendarPermissions().then(status => {
      console.log(status)
      if (status != 'authorized') {
        this.props.appActions.switchPermissionsOff()
        return
      }
      getEvents(moment(), moment().add(1, 'months')).then(events => {
        console.log(events)
        this.props.appActions.sendEvents(events).then(data=> {
          this.props.appActions.loadSuggestions()
        })
      }).catch(error => {
        console.log(error)
      });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    console.log(this.props)

		if (IS_ANDROID) {
			if (!IS_DEV && !this.props.app.isPhoneNumberVerified) {
				return <PhoneVerificationScene setPhoneVerificationCode={this._setPhoneVerificationCode}/>
			}
		}


		// Placed to rendered due to unresolved circular dependency with CalendarScene
		const CalendarNavigation = StackNavigator({
			CalendarScene: {screen: CalendarScene},
			MeetingDetailsScene: {screen: MeetingDetailsScene},
		}, {
			headerMode: 'none',
			transitionConfig: () => {duration: 500}
		})

		return (<View style={styles.container}>
				{IS_ANDROID && IS_DEV && <Button
          onPress={this.props.appActions.logOut}
          title="Log out"
          color="#841584"
        />}
        <BottomNav
					navigation={this.props.navigation}
					activeTab={this.state.activeTab}
					onTabSelect={this._switchTab}
					badges={[0, this.props.app.calendarBadges, 0]}>
          <SuggestionsScene
            iconActive={require('../res/images/home_active_1.5-66px.png')}
            icon={require('../res/images/home_gray-66px.png')}/>
          <CalendarNavigation
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
