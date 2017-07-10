/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Button, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomButton from '../components/CustomButton'
import * as appActions from '../state/actions/app';
import strings from '../res/values/strings'
import s, {themeColor} from '../res/values/styles';
import Permissions from 'react-native-permissions'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {IS_IOS, IS_TEST_PERMISSIONS_SCENE} from '../settings';
import {permissionStyles as styles} from '../res/values/styles';

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
		// projectActions: bindActionCreators(projectActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PermissionsScene extends Component {

  state = {
    isLocationGranted: false,
    isContactsGranted: false
  }
  onPressNext = () => {
    this.props.appActions.finishIntro()
  }

  checkPermissions = () => {
    Permissions.checkMultiplePermissions(['location', 'contacts'])
      .then(response => {
        //response is an object mapping type to permission
        console.log(response)
        this.setState({
          isLocationGranted: response.location == 'authorized',
          isContactsGranted: response.contacts == 'authorized',
        })
      });
  }


  requestLocationPermissions = () => {
    Permissions.requestPermission('location', 'whenInUse')
      .then(response => {
        if (response != 'authorized') {
          Permissions.openSettings()
        }
        this.setState({isLocationGranted: response == 'authorized'})
      })
  }
  requestContactPermissions = () => {
    Permissions.requestPermission('contacts')
      .then(response => {
        if (response != 'authorized') {
          Permissions.openSettings()
        }
        this.setState({isContactsGranted: response == 'authorized'})
      })
  }

  onPressSkip = () => {
    this.props.appActions.switchPermissionsOn();
  }

  componentDidUpdate = () => {
    console.log('componentWillUpdate')
    console.log(this.state)
    if (this.state.isContactsGranted
      && this.state.isLocationGranted
			&& !this.props.app.isPermissionsGranted) {
      this.props.appActions.switchPermissionsOn()
    }
  }

  componentDidMount = () => {
    this.checkPermissions()
	}

  render() {
    console.log(this.state)

			return (<View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={[s.nuxElliotHeader, {marginTop: 25}]}>Elliot</Text>
          <Text style={[styles.description, s.light, {fontSize: 15, marginHorizontal: 30}]}>{`We need your permission.
This will tell us who your friends are and which locations work for you.`}</Text>
        </View>
        <View style={[styles.middleWrapper, {flex: 1}]}>
          <CustomButton
            onPress={this.requestLocationPermissions}
            title={strings.enableLocation.toUpperCase()}
            style={styles.button}
            isFilledGreen={this.state.isLocationGranted && !IS_TEST_PERMISSIONS_SCENE}
          />
          <CustomButton
            onPress={this.requestContactPermissions}
            title={strings.enableContacts.toUpperCase()}
            style={styles.button}
            isFilledGreen={this.state.isContactsGranted}
          />
        </View>
        <View style={s.col}>
            <View style={[s.row, styles.skipWrapper]}>
              <CustomButton
                onPress={this.onPressSkip}
                title={"Continue"}
                style={styles.button}
                isWhite={true}
              />
            </View>
          <Text style={styles.description}>{strings.disclaimer}</Text>
        </View>
      </View>);
  }
}
