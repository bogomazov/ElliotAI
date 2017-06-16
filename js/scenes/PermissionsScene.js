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
import Permissions from 'react-native-permissions'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';


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
    isCalendarGranted: false,
    isContactsGranted: false
  }
  onPressNext = () => {
    this.props.appActions.finishIntro()
  }

  checkPermissions = () => {
    Permissions.checkMultiplePermissions(['location', 'contacts', 'event'])
      .then(response => {
        //response is an object mapping type to permission
        console.log(response)
        this.setState({
          isLocationGranted: response.location == 'authorized',
          isCalendarGranted: response.event == 'authorized',
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
  requestCalendarPermissions = () => {
    Permissions.requestPermission('event')
      .then(response => {
        console.log(response)
        if (response != 'authorized') {
          Permissions.openSettings()
        }
        this.setState({isCalendarGranted: response == 'authorized'})
      })
  }

	_googleSignIn = () => {
		GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
			GoogleSignin.configure({
				 scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
				 iosClientId: "", // only for iOS
				 webClientId: "", // client ID of type WEB for your server (needed to verify user ID and offline access)
				 offlineAccess: true // if you want to access Google API on behalf of the user FROM YOUR SERVER
				})
				.then(() => {
					GoogleSignin.signIn()
						.then((user) => {
						  console.log(user);
						  this.setState({user: user});
						})
						.catch((err) => {
						  console.log('WRONG SIGNIN', err);
						})
						.done();
				 // you can now call currentUserAsync()
				});
		})
		.catch((err) => {
		  console.log("Play services error", err.code, err.message);
		})
	}

  componentDidUpdate = () => {
    console.log('componentWillUpdate')
    console.log(this.state)
    if (this.state.isCalendarGranted
      && this.state.isContactsGranted
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
          <Text style={styles.logoText}>Elliot</Text>
          <Text style={styles.description}> Elliot needs permissions</Text>
        </View>
        <View style={styles.middleWrapper}>
          {!this.state.isLocationGranted && <CustomButton
            onPress={this.requestLocationPermissions}
            title={strings.enableLocation}
            style={styles.button}
            isWhite
          />}
          {!this.state.isCalendarGranted && <CustomButton
            onPress={this.requestCalendarPermissions}
            title={strings.enableCalendar}
            style={styles.button}
            isWhite
          />}
          {!this.state.isContactsGranted && <CustomButton
            onPress={this.requestContactPermissions}
            title={strings.enableContacts}
            style={styles.button}
            isWhite
          />}
					<GoogleSigninButton
				    style={{width: 212, height: 48}}
				    size={GoogleSigninButton.Size.Wide}
				    color={GoogleSigninButton.Color.Light}
						onPress={this._googleSignIn}
				    />
        </View>
        <Text style={styles.description}>{strings.disclaimer}</Text>
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#817550',
    padding: 25
  },
  topWrapper: {
    flexDirection: 'column',
  },
  logoText: {
    color: '#fff',
    fontSize: 46,
    // flex: 1,
  },
  description: {
    color: '#fff',
  },
  middleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
  }
});
