/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Image, Button, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import IntroSwipe from '../containers/Intro'
import * as appActions from '../state/actions/app';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import RNCalendarEvents from 'react-native-calendar-events';
import { fromDateToIsoStr } from '../utils/DateTime'
import { getEvents } from '../utils/Calendar'
import moment from 'moment'
import {IS_DEV} from '../settings'

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}



@connect(mapStateToProps, mapDispatchToProps)
export default class SplashScene extends Component {


  // _requestCurrentLocation = () => {
	// 	console.log('request Location')
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log(position)
  //         this.props.appActions.sendLocation(position.coords.longitude, position.coords.latitude, position.timestamp)
  //       },
  //       (error) => alert(JSON.stringify(error))
  //       // {enableHighAccuracy: false, timeout: 10000, maximumAge: 25000}
  //     );
	// }

  render() {
			if (IS_DEV) {
				alert('Staging server!')
			}
			return (<View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../res/images/launch_logo.png')}/>
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  swiper: {
  },
  button: {
    height: 200
  },
	image: {
		width: 200,
		height: 300
	}
});
