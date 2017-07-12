import React, {Component} from 'react';
import Permissions from 'react-native-permissions';
import MainScene from './MainScene';
import LoginScene from './LoginScene';
import UserSuggestionsScene from './UserSuggestionsScene';
import FriendsScene from './FriendsScene';
import PermissionsScene from './PermissionsScene';
import CalendarPermissionScene from './CalendarPermissionScene';
import {IS_ANDROID, IS_TEST_PERMISSIONS_SCENE} from '../settings';
import {StackNavigator} from 'react-navigation';
import {AppState} from 'react-native';
import {connectToApp} from '../utils/ReduxConnect';

const Navigation = StackNavigator({
  MainScene: {screen: MainScene},
  UserSuggestionsScene: {screen: UserSuggestionsScene},
  FriendsScene: {screen: FriendsScene},
}, {
  headerMode: 'none',
  transitionConfig: () => {duration: 500}
})

@connectToApp
export default class LandingScene extends Component {

  componentWillMount() {
    this._checkPermissions();
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (nextState) => {
    console.log(nextState);
    if (nextState === 'active'
        && this.props.app.isPhoneNumberVerified) {
      console.log('checking permissions again');
      this._checkPermissions();
    }
  }

  // Switches permissions off if needed
  _checkPermissions = () => {
    if (!this.props.app.isPermissionsGranted) {
      return;
    }
    Permissions.checkMultiplePermissions(['location', 'contacts', 'event']).then(
      (response) => {
        if (response.location != 'authorized' ||
            response.contacts != 'authorized') {
          this.props.appActions.switchPermissionsOff();
        }
      }
    );
  }

  render() {
    if (!this.props.app.isLoggedIn) {
      return <LoginScene/>
    }
    if (!this.props.app.didFinishCalendarIntro) {
      return <CalendarPermissionScene/>
    }
    if (!this.props.app.isPermissionsGranted || IS_TEST_PERMISSIONS_SCENE) {
      return <PermissionsScene/>
    }
    return <Navigation/>
  }
}
