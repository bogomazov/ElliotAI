/**
 * Created by andrey on 10/18/16.
 @flow
 */
import { AppState, Alert, View, Text, TouchableHighlight } from 'react-native';
import Permissions from 'react-native-permissions'
import React, { Component } from 'react'
import {IS_IOS, IS_TEST_PERMISSIONS_SCENE} from '../settings';
import {connectToApp} from '../utils/ReduxConnect';
import CustomButton from '../components/CustomButton'
import s, { permissionStyles as styles } from '../res/values/styles';
import strings from '../res/values/strings'

@connectToApp
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
    Alert.alert('Are you sure?', 'Elliot needs these permissions to know who your friends are and which locations work for you.', [
      {text: 'Cancel'},
      {text: 'Yes', onPress: () => {
        this.props.appActions.switchPermissionsOn()
      }}
    ], {
      cancelable: true
    });
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
    AppState.addEventListener('change', this.onAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (nextState) => {
    if (nextState === 'active') {
      this.checkPermissions()
    }
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
            {IS_IOS &&
              <View style={[s.row, styles.skipWrapper]}>
                <TouchableHighlight onPress={this.onPressSkip} underlayColor='white' activeOpacity={0.5}>
                  <Text style={[s.bold, s.textColorTheme, {fontSize: 15, paddingVertical: 20}]}>CONTINUE</Text>
                </TouchableHighlight>
              </View>
            }
          <Text style={styles.description}>{strings.disclaimer}</Text>
        </View>
      </View>);
  }
}
