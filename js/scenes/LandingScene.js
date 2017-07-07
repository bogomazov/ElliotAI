import {connect} from 'react-redux';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import Permissions from 'react-native-permissions';
import MainScene from './MainScene';
import LoginScene from './LoginScene';
import UserSuggestionsScene from './UserSuggestionsScene';
import FriendsScene from './FriendsScene';
import PermissionsScene from './PermissionsScene';
import CalendarPermissionScene from './CalendarPermissionScene';
import {IS_ANDROID} from '../settings';
import {StackNavigator} from 'react-navigation';
import * as appActions from '../state/actions/app';
import {AppState} from 'react-native';

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

const Navigation = StackNavigator({
  MainScene: {screen: MainScene},
  UserSuggestionsScene: {screen: UserSuggestionsScene},
  FriendsScene: {screen: FriendsScene},
}, {
  headerMode: 'none',
  transitionConfig: () => {duration: 500}
})

@connect(mapStateToProps, mapDispatchToProps)
export default class LandingScene extends Component {

  componentWillMount() {
    this._checkPermissions();
  }

  _checkPermissions = () => {
    if (!this.props.app.isPermissionsGranted) {
      return
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
    if (IS_ANDROID) {
      if (!this.props.app.isLoggedIn) {
        return <LoginScene/>
      }
    }
    if (!this.props.app.didFinishCalendarIntro) {
      return <CalendarPermissionScene/>
    }
    if (!this.props.app.isPermissionsGranted) {
      return <PermissionsScene/>
    }
    return <Navigation/>
  }
}
