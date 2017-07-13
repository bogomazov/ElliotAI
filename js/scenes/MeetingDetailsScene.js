import {
  View,
  ScrollView,
  Linking,
  Alert,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import {phonecall} from 'react-native-communications'
import IconEvil from 'react-native-vector-icons/EvilIcons';
import IconIon from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react'
import { IS_IOS } from '../settings';
import {connectToApp} from '../utils/ReduxConnect';
import Card from '../components/Card';
import RemoteImage from '../components/RemoteImage';
import ShareAccess from '../utils/ShareModule';
import s, {themeColorLight} from '../res/values/styles'

@connectToApp
export default class MeetingDetailsScene extends Component {
    state = {
      url: null,
      number: null
    }

    _onReschedulePress = () => {
      Alert.alert(
        'Are you sure?',
        'This will cancel the meeting and notify ' + this.props.meeting.friend.first_name + '.',
        [
          {text: 'Never mind', onPress: () => console.log('Never mind')},
          {text: 'Reschedule', onPress: () => {
            this.props.appActions.cancelMeeting(this.props.meeting).then((response) => {
                            this.props.navigation.goBack();
                            this.props.appActions.loadScheduledMeetings()
                            this.props.appActions.loadSuggestions();
            })
          }},
        ],
        { cancelable: true }
        )
    }

  componentWillMount = () => {
    this.props = {...this.props, ...this.props.navigation.state.params}

    const friend = this.props.meeting.friend
    const numbers = this._getContactNumbersByStr(friend.first_name + ' ' + friend.last_name)

    console.log(numbers)
    if (numbers.length > 0) {
      console.log(numbers[0]);
      this.setState({
        number: numbers[0]
      })
    }
  }

  _getContactNumbersByStr = (str) => {
    return this.props.app.numbers.filter(number => {
      const fullName = `${number.firstName? number.firstName: ''}${number.middleName? ' ' + number.middleName: ''} ${number.lastName? number.lastName: ''}`
      const trimmedName = fullName.trim();
      // ignore empty names
      return trimmedName.length !== 0 && str.toLowerCase().includes(trimmedName.toLowerCase())
    })
  }

    _keyExtractor = (item, index) => item.id;

  _onYelpPress = () => {
    Linking.canOpenURL("yelp4:").then(supported => {
      if (supported) {
        Linking.openURL("yelp4:///search?find_desc=" + this.props.meeting.meeting_type)
      } else {
        Linking.openURL("https://www.yelp.com/search?find_desc=" + this.props.meeting.meeting_type)
      }
    })
  }

  _onMessengerPress = () => {
    Linking.openURL("fb-messenger-public://");
  }

  _onOpenTablePress = () => {
    const time = this.props.meeting.meeting_time
    Linking.openURL(`https://www.opentable.com/s/?covers=2&dateTime=${time.format("YYYY-MM-DD")}%20${time.format("HH")}%3A${time.format("mm")}&metroId=${this.props.app.metroId}`);
  }

  _sendSMS = () => {
    if (IS_IOS) {
      ShareAccess.sendSMS([this.state.number.contact], "").then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
      return;
    }
    const url = `sms:${this.state.number.contact}`
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Unsupported url: ' + url)
      } else {
        return Linking.openURL(url)
      }
    }).catch(err => console.error('An error occurred', err))
  }

  _call = () => {
    const number = this.state.number.contact;
    Alert.alert('Calling', number, [
      {text: 'Cancel', onPress: () => console.log('Cancelled the call')},
      {text: 'Call', onPress: () => phonecall(number, false)}
    ], {
      cancelable: true
    });
  }

  _getRow = ({isShown = true, title, iconComponent, iconName, style, source, onPress}) => {
    return isShown && <TouchableHighlight onPress={onPress} underlayColor={themeColorLight}>
    <View style={[s.row, s.alignItemsCenter, s.borderTopGrey]}>
      <Text style={[s.flex, styles.optionText]}>{title}</Text>
      {iconComponent?
        React.createElement(iconComponent, {name: iconName, style, size: ICON_SIZE, backgroundColor: "#fff", color: "#535353"})
        :
        <Image
          style={[styles.icon, s.margin10, style]}
          source={source}/>
      }
    </View>
  </TouchableHighlight>}

  render() {
    // TODO: Avoid combining navigation params to prevent bugs like this.
    this.props = {...this.props, ...this.props.navigation.state.params}
    const meeting = this.props.meeting
    console.log(this.props)
    console.log(this.state)

    const ROWS = [{
        title: meeting.meeting_time.format("h:mm A"),
        iconComponent: IconIon,
        iconName: "ios-time-outline",
        style: s.margin10,
        source: null,
        onPress: () => {},
      },
      {
        title: "Home",
        iconComponent: IconEvil,
        iconName: "location",
        style: styles.marginLocation,
        source: null,
        onPress: () => {},
      },
      {
        title: "Message on Facebook",
        iconComponent: null,
        iconName: null,
        style: null,
        source: require('../res/images/fb-icon-66px.png'),
        onPress: this._onMessengerPress,
      },
      {
        title: "Find a place on Yelp",
        iconComponent: null,
        iconName: null,
        style: null,
        source: require('../res/images/yelp-icon-66px.png'),
        onPress: this._onYelpPress,
        isShown: !meeting.isCall() && !meeting.isPast()
      },
      {
        title: "Reserve a table",
        iconComponent: null,
        iconName: null,
        style: null,
        source: require('../res/images/opentable-icon-66px.png'),
        onPress: this._onOpenTablePress,
        isShown: this.props.app.metroId && !meeting.isCall() && !meeting.isPast()
      },
      {
        title: `Call ${meeting.friend.first_name}`,
        iconComponent: null,
        iconName: null,
        style: null,
        source: require('../res/images/call-66px.png'),
        onPress: this._call,
        isShown: this.state.number
      },
      {
        title: `Send ${meeting.friend.first_name} SMS`,
        iconComponent: null,
        iconName: null,
        style: null,
        source: require('../res/images/messageicon.png'),
        onPress: this._sendSMS,
        isShown: this.state.number
      }
    ].map((item) => this._getRow(item))
    console.log(ROWS)

      return (
        <Card style={{flex: 1, marginBottom: 15, marginTop: (IS_IOS ? 32 : 12), overflow: 'hidden'}}>
          <IconEvil.Button name="close" backgroundColor="#fff" size={40} color="#A0A0A0" onPress={() => this.props.navigation.goBack()} />
          <View style={[s.row, s.margin10]}>
             <View style={[s.column, s.flex]}>
                  <Text style={[s.textColorTheme, s.bold, styles.titleText]}>{meeting.meeting_type} with {meeting.friend.first_name} {meeting.friend.last_name}</Text>
                  <Text style={[s.marginTop10, s.light, styles.titleText]}>{meeting.getDateStr()}</Text>
              </View>
            <RemoteImage
                style={[s.avatar]}
                source={{ uri: meeting.friend.image }}/>
          </View>
          <View style={[s.column, s.borderTop, s.flex]}>
            <ScrollView>
              {ROWS}
            </ScrollView>
          </View>
          {!meeting.isPast() && <TouchableWithoutFeedback onPress={this._onReschedulePress}>
            <View style={[styles.bottom, s.row, s.alignItemsCenter, s.borderTop]}>
              <Text style={[s.flex, styles.bottomText, styles.optionText]}>Reschedule</Text>
              <IconEvil.Button name="close-o" style={[styles.bottomIcon]} size={40} backgroundColor="#fff" color="#535353" />
            </View>
          </TouchableWithoutFeedback>}
        </Card>
      );
  }
}

const ICON_SIZE = 35

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  bottom: {
    height: 60,
  },
  bottomIcon: {
    padding: 0
  },
  bottomLine: {
    height: 1,
  },
  icon: {
    height: 30,
    width: 30
  },
  marginRight: {
    marginRight: 10
  },
  optionText: {
    fontSize: 17,
    marginLeft: 15,
  },
  titleText: {
    fontSize: 17,
    marginLeft: 5,
  },
  bottomText: {
    color: '#49ADAF'
  },
  marginLocation: {
    margin: 10,
    marginRight: 7,
  }
});
