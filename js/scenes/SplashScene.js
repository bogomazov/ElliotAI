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
  checkLocation = () => {
    console.log('did mount')
    console.log(this.props.app.isRehydrated)
    console.log(this.props.app.isLoggedIn)

    if (this.props.app.isRehydrated && this.props.app.isLoggedIn) {
      console.log('checkLocationServicesIsEnabled')
      this.requestCurrentLocation()
      // LocationServicesDialogBox.checkLocationServicesIsEnabled({
      //     message: "<h2>Use Location ?</h2>This aspp wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      //     ok: "YES",
      //     cancel: "NO"
      // }).then(function(success) {
      //         console.log(success); // success => "enabled"
      //         this.requestCurrentLocation()
      // }).catch((error) => {
      //     console.log(error.message); // error.message => "disabled"
      // });
    }
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
      {enableHighAccuracy: false, timeout: 3000, maximumAge: 25000}
    );
	}

  render() {
      this.checkLocation()
			return (<View style={styles.container}>
        <Image
          style={{width: 100, height: 100}}
          source={require('../res/images/Icon-40@3x.png')}/>
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
    // flex: 1,
  },
  button: {
    height: 200
    // flex: 1,
  }
});
