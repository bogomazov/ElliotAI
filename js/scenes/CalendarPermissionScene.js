import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomButton from '../components/CustomButton'
import * as appActions from '../state/actions/app';
import strings from '../res/values/strings'
import s from '../res/values/styles';
import Permissions from 'react-native-permissions'
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

GoogleSignin.configure({
   scopes: ["https://www.googleapis.com/auth/calendar.readonly"], // what API you want to access on behalf of the user, default is email and profile
   iosClientId: "112753570022-pvgppqdcq3ej00hj6jarphalsu1i1p3r.apps.googleusercontent.com", // only for iOS
   webClientId: "", // client ID of type WEB for your server (needed to verify user ID and offline access)
   offlineAccess: false // if you want to access Google API on behalf of the user FROM YOUR SERVER
})

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {appActions: bindActionCreators(appActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CalendarPermissionScene extends Component {

  componentWillMount() {
    GoogleSignin.signOut();
    Permissions.getPermissionStatus('event').then((response) => {
      this.props.appActions.setIsCalendarGranted(response == 'authorized');
    });
  }

  requestCalendarPermissions = () => {
    Permissions.requestPermission('event').then((response) => {
      if (response !== 'authorized') {
        Permissions.openSettings();
      }
      this.props.appActions.setIsCalendarGranted(response === 'authorized');
    });
  }

	_googleSignIn = () => {
		GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
      console.log('has play services');
			console.log('signing in');
			GoogleSignin.signIn()
				.then((user) => {
				  console.log(user);
          // TODO: send the token to back-end,
          // store this action in the app state to remember not to show google sign-in next time.
				})
				.catch((err) => {
				  console.log('WRONG SIGNIN', err);
				})
				.done();
		})
		.catch((err) => {
		  console.log("Play services error", err.code, err.message);
		})
	}

  onPressContinue = () => {
    if (this.props.app.isCalendarGranted) {
      this.props.appActions.didSeeCalendarPermissionScene();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={styles.logoText}>Elliot</Text>
          <Text style={styles.description}> Elliot needs access to your calendars</Text>
        </View>
        <View style={styles.middleWrapper}>
          {!this.props.app.isCalendarGranted &&
            <CustomButton
              onPress={this.requestCalendarPermissions}
              title={strings.enableCalendar}
              style={styles.button}
              isWhite
            />
          }
          <Text style={[s.margin10, s.bold, s.textColorWhite, {textAlign: 'center'}]}>We will need an access to your Google Calendar!</Text>
          <GoogleSigninButton
            style={{width: 212, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={this._googleSignIn}
          />
        </View>
        <View style={s.col}>
          <View style={[s.row, styles.skipWrapper]}>
            <CustomButton
              onPress={this.onPressContinue}
              title={"Continue"}
              style={styles.button}
              isWhite={this.props.app.isCalendarGranted}
            />
          </View>
          <Text style={styles.description}>{strings.disclaimer}</Text>
        </View>
      </View>
    );
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
    fontSize: 17,
    padding: 10,
  },
  skipWrapper: {
    justifyContent: 'flex-end',
  }
});
