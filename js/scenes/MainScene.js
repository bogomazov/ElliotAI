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

import { setCustomText } from 'react-native-global-props';

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

	requestCurrentLocation = () => {
		console.log('request Location')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        var initialPosition = JSON.stringify(position);
				console.log(initialPosition)

        // this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 25000}
    );
	}


  render() {
		console.log(this.props)
		// this.props.appActions.newAccessToken('new one')


			if (!this.props.app.isRehydrated) {
				return <SplashScene/>
			}

			if (!this.props.app.isLoggedIn) {
				return <LoginScene/>
			}

			// requestLocation?
			// check permissions in the background
			// if (!this.props.app.isLocationGiven) {
			// 	this.requestCurrentLocation()
			// }
			if (!this.props.app.isPermissionsGiven || !this.props.app.isLocationGiven) {
				this.requestCurrentLocation()
				return <PermissionsScene/>
			}

			return (<View style={styles.container}>
				<Text>MainScene</Text>
				<Button
          onPress={this.logUserOut}
          title="Log out"
          color="#841584"
          style={{flex: 3}}
        />
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
  bottom_bar: {
    // width: 100%,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: 'gray',
    borderWidth: 1
  },
  input: {
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    margin: 10
  },
	modal: {
		width: 50,
	}
});
