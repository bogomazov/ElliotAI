import {
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  View,
  TextInput,
  StyleSheet,
  Text,
} from 'react-native';
import {asYouType, getPhoneCode, parse, format} from 'libphonenumber-js'
import DeviceInfo from 'react-native-device-info'
import React, { Component } from 'react'
import {IS_ANDROID, IS_IOS} from '../settings'
import {connectToApp} from '../utils/ReduxConnect';
import {loadContacts} from '../utils/Contacts'
import CustomButton from '../components/CustomButton'
import PhoneNumber from '../utils/PhoneNumberModule'
import s, {themeColor} from '../res/values/styles'
import strings from '../res/values/strings'

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

@connectToApp
export default class PhoneVerificationScene extends Component {
  state = {
    phoneNumber: '',
    isSent: false,
    didGuessPhoneNumber: false,
  }
  componentWillMount = () => {
    console.log(this.props)
    const country = DeviceInfo.getDeviceCountry();
    const countryCode = getPhoneCode(country);
    this.formatter = new asYouType();
    this.formatter.county_phone_code = countryCode
    if (IS_ANDROID) {
      PhoneNumber.getPhoneNumber().then((phoneNumber) => this.setState({phoneNumber}))
    } else {;
      if (this.props.app.isContactsLoaded) {
        this.guessPhoneNumber();
      } else {
        loadContacts();
        this.setState({
          phoneNumber: `+${countryCode}`
        });
      }
    }
  }

  componentDidUpdate() {
    if (!this.state.didGuessPhoneNumber
      && this.props.app.isContactsLoaded
      && IS_IOS) {
      this.guessPhoneNumber();
    }
  }

  // Guess user's name from device name
  getNameGuess = () => {
    const deviceName = DeviceInfo.getDeviceName();
    const parts = deviceName.split(/[^A-Za-z]/);
    console.log(parts);
    return parts[0];
  }

  guessPhoneNumber = () => {
    this.setState({didGuessPhoneNumber: true});
    const guessedName = this.getNameGuess();
    console.log(guessedName);
    const numbers = this.props.app.numbers.filter(number => {
      const fullName = `${number.firstName} ${number.middleName} ${number.lastName}`;
      return fullName.toLowerCase().includes(guessedName.toLowerCase());
    });
    console.log(numbers);
    if (numbers.length > 0) {
      const number = numbers[0].contact;
      const formattedNumber = format(number, DeviceInfo.getDeviceCountry(), 'International');
      this.setState({phoneNumber: formattedNumber});
    }
  }

  _onVerifyPressed = () => {
    const token = getRandomArbitrary(1000, 9999)
    console.log(token)
    this.props.setPhoneVerificationCode(token)
    const parsedNumber = parse(this.state.phoneNumber, {
      country: {
        default: DeviceInfo.getDeviceCountry(),
      }
    });
    if (!parsedNumber.phone || !parsedNumber.country) {
      Alert.alert('Invalid phone number', 'Please make sure to enter your phone number correctly.',
        [{text: 'OK'}],
        {cancelable: true},
      );
      return;
    }
    const numberE164 = format(parsedNumber.phone, parsedNumber.country, 'International_plaintext');
    console.log(numberE164);
    this.props.appActions.sendPhoneNumber(numberE164, token).then((response) => {
      this.setState({isSent: true})
    })
    Keyboard.dismiss();
  }

  render() {
    console.log(this.props)
    console.log(this.state);
    this.formatter.reset();
    const formattedNumber = this.formatter.input(this.state.phoneNumber);
    console.log(formattedNumber);
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={s.nuxElliotHeader}>Elliot</Text>
          <Text style={[s.textAlignCenter, s.light, styles.introText]}>{strings.phoneIntro}</Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              selectionColor='rgb(97, 97, 97)'
              onChangeText={(phoneNumber) => this.setState({phoneNumber})}
              value={formattedNumber}></TextInput>
          </View>
          {this.state.isSent && <Text style={[s.textAlignCenter, s.bold, s.textColorTheme]}>You will receive an SMS message that will have a link to continue so you can start using Elliot!</Text>}
        </View>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.wrapper}>
            <CustomButton
              style={styles.verifyButton}
              onPress={this._onVerifyPressed}
              title={this.state.isSent ? "SEND AGAIN" : "VERIFY"}
              isFilled
            />
            <Text style={[s.textAlignCenter, styles.disclaimer]}>{strings.phoneDisclaimer}</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'white',
    paddingHorizontal: 40,
  },

  wrapper: {
    justifyContent: 'flex-start',
  },

  image: {
    height: 100,
    width: 100
  },

  textInputWrapper: {
    marginTop: 30,
    borderBottomWidth: 2,
    borderColor: '#f1f2f1',
    borderStyle: 'solid',
  },

  textInput: {
    height: 40,
    alignSelf: 'stretch',
    alignItems: 'center',
    fontSize: 20,
    color: 'rgb(97, 97, 97)',
  },

  button: {
    width: 300,
    alignSelf: 'stretch',
  },

  topBarIcon: {
    height: 40,
    width: 40
  },

  introText: {
    textAlign: 'left',
    marginTop: 15,
    fontSize: 16,
    color: 'rgb(97, 97, 97)'
  },

  verifyButton: {
    color: 'white',
    backgroundColor: themeColor,
    alignSelf: 'stretch',
    borderRadius: 5,
    fontFamily: 'OpenSans-ExtraBold',
    padding: 10,
    marginTop: 20,
  },

  disclaimer: {
    marginVertical: 20,
    fontSize: 13,
    color: 'rgb(97, 97, 97)',
  }
});
