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
  Image,
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
import { mainBackgroundColor, themeColorThird } from '../res/values/styles'
import BottomNav from '../containers/BottomNavigation'
import SuggestionsScene from '../scenes/SuggestionsScene'
import InviteFriendsScene from '../scenes/InviteFriendsScene'
import MeetingDetailsScene from '../scenes/MeetingDetailsScene'
import CalendarScene from '../scenes/CalendarScene'
import PhoneVerificationScene from '../scenes/PhoneVerificationScene'
import DeepLinking from 'react-native-deep-linking'
import {loadContacts} from '../utils/Contacts'
import {getEvents, checkCalendarPermissions} from '../utils/Calendar'
import {getLocation, checkLocationAccess} from '../utils/Location'
import moment from 'moment'
import {StackNavigator, TabNavigator} from 'react-navigation';
import {IS_DEV, IS_ANDROID, IS_IOS} from '../settings'
import {Store} from '../index'

export const MAIN_TAB = 0
export const CALENDAR_TAB = 1
export const INVITE_FRIENDS_TAB = 2

// open-tab notif constants
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

const CalendarNavigation = StackNavigator({
  CalendarScene: {screen: CalendarScene},
  MeetingDetailsScene: {screen: MeetingDetailsScene},
}, {
  headerMode: 'none',
  transitionConfig: () => {duration: 500}
})

class TabBarIcon extends Component {
  render = () => <View>
    <Image style={s.tabIcon} source={this.props.focused? require('../res/images/calendar_active_1.5-66px.png'): require('../res/images/calenar_grey-66px.png')}/>
    {this.props.app.calendarBadges > 0 && <Text style={styles.badge}>{this.props.app.calendarBadges}</Text>}
  </View>
}

const TabIcon = connect(mapStateToProps)(TabBarIcon);

const BottomTabNavigation = TabNavigator({
  SuggestionsTab: {screen: SuggestionsScene},
  CalendarTab: {
    screen: CalendarNavigation,
    navigationOptions: {
      tabBarIcon: ({tintColor, focused}) => <TabIcon focused={focused} />
    }
  },
  InviteFriendsTab: {screen: InviteFriendsScene},
}, {
  ...TabNavigator.Presets.iOSBottomTabs,
  // lazy: true,
  tabBarOptions: {
    showLabel: false,
    style: {
      backgroundColor: 'white',
    }
  }
})

@connect(mapStateToProps, mapDispatchToProps)
export default class MainScene extends Component {

	state = {
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
          this.tabNavigator._navigation.navigate('SuggestionsTab');
          break;
        case openInvite:
          this.tabNavigator._navigation.navigate('InviteFriendsTab');
          break;
        case confirmed:
          this.tabNavigator._navigation.navigate('CalendarTab');
          break;
      }
    });

    Linking.getInitialURL().then(url => {
      if (url) {
        this._handleUrl({url})
      }
    })
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
    checkLocationAccess().then(() => {
      return getLocation().then(location => {
        console.log(location);
        this.props.appActions.sendLocation(location.lng, location.lat, location.timestamp).then(data => {
          this.props.appActions.newLocation(location.lng, location.lat, location.timestamp)
          this._updateCalendarEvents()
        })
      })
    }).catch(error => {
      console.log(error);
      this._updateCalendarEvents()
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
        this.props.appActions.storeDeviceEvents(events);
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
    console.log(this.tabNavigator);
		if (IS_ANDROID) {
			if (!IS_DEV && !this.props.app.isPhoneNumberVerified) {
				return <PhoneVerificationScene setPhoneVerificationCode={this._setPhoneVerificationCode}/>
			}
		}

    return (
      <View style={styles.container}>
        {IS_ANDROID && IS_DEV && <Button
          onPress={this.props.appActions.logOut}
          title="Log out"
          color="#841584"
        />}
        <BottomTabNavigation
          ref={(ref) => this.tabNavigator = ref}
          screenProps={{mainNav: this.props.navigation}}
          onNavigationStateChange={(prevState, currentState) => {
            console.log(currentState)
            if (currentState.index == CALENDAR_TAB) {
              if (this.props.app.calendarBadges > 0) {
                this.props.appActions.setCalendarBadges(0)
                this.props.appActions.resetBadges()
              }
            }
        }}/>
      </View>
    );
  }
}





export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainBackgroundColor
  },
	badge: {
    position: 'absolute',
		width: 20,
		height: 20,
    top: -5,
    right: -5,
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: 10,
    overflow: 'hidden',
		color: 'white',
		backgroundColor: themeColorThird,
	}
});
