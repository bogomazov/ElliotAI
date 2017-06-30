import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CustomButton from '../components/CustomButton'
import * as appActions from '../state/actions/app';
import strings from '../res/values/strings'
import s from '../res/values/styles';
import GoogleLoginButton from '../containers/GoogleLoginButton';

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {appActions: bindActionCreators(appActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CalendarPermissionScene extends Component {
  state = {
    loggedIn: false,
  }

  _onLogin = (googleUser) => {
    console.log(googleUser);
    this.setState({loggedIn: true});
    this.props.appActions.finishCalendarIntro()
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={styles.logoText}>Elliot</Text>
          <Text style={styles.description}> Elliot needs access to your calendars</Text>
        </View>
        <View style={styles.middleWrapper}>
          <Text style={[s.margin10, s.bold, s.textColorWhite, {textAlign: 'center'}]}>We will need an access to your Google Calendar!</Text>
          <GoogleLoginButton onLogin={this._onLogin} />
        </View>
        <Text style={styles.description}>{strings.disclaimer}</Text>
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
});
