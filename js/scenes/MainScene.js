/**
 * Created by andrey on 10/18/16.
 @flow
 */
import { Linking, View, StyleSheet, Text, AppState, Image } from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import { connect } from 'react-redux'
import DeepLinking from 'react-native-deep-linking'
import React, { Component } from 'react'
import { IS_DEV } from '../settings';
import {connectToApp} from '../utils/ReduxConnect';
import {getLocation, checkLocationAccess} from '../utils/Location'
import {loadContacts} from '../utils/Contacts'
import { mainBackgroundColor, themeColorThird } from '../res/values/styles'
import CalendarScene from '../scenes/CalendarScene'
import InviteFriendsScene from '../scenes/InviteFriendsScene'
import MeetingDetailsScene from '../scenes/MeetingDetailsScene'
import PhoneVerificationScene from '../scenes/PhoneVerificationScene'
import SettingsScene from '../scenes/SettingsScene'
import SuggestionsScene from '../scenes/SuggestionsScene'

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
  SettingsTab: {screen: SettingsScene},
}, {
  ...TabNavigator.Presets.iOSBottomTabs,
  tabBarOptions: {
    showLabel: false,
    style: {
      backgroundColor: 'white',
    }
  }
})

@connectToApp
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
    this.props.appActions.loadFriends()
    loadContacts();
  }

  _loadScheduledMeetings = () => {
    this.props.appActions.calendarLoading();
    this.props.appActions.loadScheduledMeetings().catch(error=>console.error(error))
  }

  _refreshFeed = () => {
    checkLocationAccess().then(() => {
      return getLocation().then(location => {
        console.log(location);
        this.props.appActions.sendLocation(location.lng, location.lat, location.timestamp).then(data => {
          this.props.appActions.newLocation(location.lng, location.lat, location.timestamp)
          this.props.appActions.loadSuggestions();
        })
      })
    }).catch(error => {
      console.log(error);
      this.props.appActions.loadSuggestions();
    })
  }

  render() {
    console.log(this.props)
    console.log(this.tabNavigator);
    if (!IS_DEV && !this.props.app.isPhoneNumberVerified) {
      return <PhoneVerificationScene setPhoneVerificationCode={this._setPhoneVerificationCode}/>
    }
    return (
      <View style={styles.container}>
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
