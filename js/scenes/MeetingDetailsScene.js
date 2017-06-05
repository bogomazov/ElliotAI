import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, ScrollView, Linking, Alert, TouchableWithoutFeedback, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import SuggestionCard from '../components/SuggestionCard'
import IntroLabel from '../components/IntroLabel'
import strings from '../res/values/strings'
import NavigationTopBar from '../components/NavigationTopBar';
import Card from '../components/Card';
import Suggestion from '../state/models/suggestion';
import s from '../res/values/styles'
import IconIon from 'react-native-vector-icons/Ionicons';
import IconEvil from 'react-native-vector-icons/EvilIcons';
// Ionicons
// ios-time-outline
// EvilIcons
// location
// close
// close-o
const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MeetingDetailsScene extends Component {
    state = {
			url: null
    }

		_onReschedulePress = () => {
			Alert.alert(
				'Are you sure?',
				'Once you reschedule, you will have to schedule a meeting again!',
				[
					{text: 'Never mind', onPress: () => console.log('Never mind')},
					{text: 'Reschedule', onPress: () => {
						this.props.appActions.cancelMeeting(this.props.meeting).then((response) => {
							this.props.onMeetingCancel(this.props.meeting)
						})
					}},
				],
				{ cancelable: true }
				)
		}

	componentWillMount = () => {

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
		Linking.openURL("https://www.opentable.com/s/?covers=2&dateTime=");
	}

  render() {
    const meeting = this.props.meeting
    console.log(this.props)
      return (
        <Card style={{flex: 1}}>
          <IconEvil.Button name="close" backgroundColor="#fff" size={25} color="#A0A0A0" onPress={() => this.props.onClosePress(meeting)} />
          <View style={[s.row, s.margin10]}>
             <View style={[s.column, s.flex]}>
                  <Text style={[s.textColorTheme, s.bold]}>{meeting.meeting_type} with {meeting.friend.first_name} {meeting.friend.last_name}</Text>
                  <Text style={s.marginTop10}>{meeting.getDateStr()}</Text>
              </View>
            <Image
                style={[s.avatar]}
                source={{ uri: meeting.friend.image }}/>
          </View>

          <View style={[s.column, s.borderTop, s.padding10, s.flex]}>
						<ScrollView>
            <View style={[s.row, s.alignItemsCenter]}>
              <Text style={[s.flex]}>{meeting.meeting_time.format("h:mm A")}</Text>
              <IconIon name="ios-time-outline" style={[s.margin10]} size={ICON_SIZE} backgroundColor="#fff" color="#535353" />
            </View>
            <View style={[s.row, s.alignItemsCenter, s.borderTopGrey]}>
              <Text style={[s.flex]}>Home</Text>
              <IconEvil name="location" style={styles.marginLocation} size={ICON_SIZE} backgroundColor="#fff" color="#535353" />
            </View>
						<TouchableHighlight onPress={this._onMessengerPress}>
	            <View style={[s.row, s.alignItemsCenter, s.borderTopGrey]}>
	              <Text style={[s.flex]}>Message on Facebook</Text>
	              <Image
	                style={[styles.icon, s.margin10]}
	                source={require('../res/images/fb-icon-66px.png')}/>
	            </View>
						</TouchableHighlight>
						<TouchableHighlight onPress={this._onYelpPress}>
	            <View style={[s.row, s.alignItemsCenter, s.borderTopGrey]}>
	              <Text style={[s.flex]}>Find places</Text>
	              <Image
	                style={[styles.icon, s.margin10]}
	                source={require('../res/images/yelp-icon-66px.png')}/>
	            </View>
						</TouchableHighlight>
						<TouchableHighlight onPress={this._onOpenTablePress}>
	            <View style={[s.row, s.alignItemsCenter, s.borderTopGrey]}>
	              <Text style={[s.flex]}>Reserve a table</Text>
	              <Image
	                style={[styles.icon, s.margin10]}
	                source={require('../res/images/opentable-icon-66px.png')}/>
	            </View>
						</TouchableHighlight>
						{[0, 0].map((item, i) => <View key={i} style={[s.row, s.borderTopGrey, styles.bottom]}></View>)}
						</ScrollView>
          </View>
					{!meeting.isPast() && <TouchableWithoutFeedback onPress={this._onReschedulePress}>
	          <View style={[styles.bottom, s.row, s.alignItemsCenter, s.borderTop]}>
	            <Text style={[s.flex, styles.bottomText, s.margin10]}>Reschedule</Text>
							<IconEvil.Button name="close-o" style={[ styles.bottomIcon]} size={35} backgroundColor="#fff" color="#535353" />
	          </View>
					</TouchableWithoutFeedback>}
					{/* {this.state.url && <View style={{height: 0, width: 0}}><WebViewNavigator url={this.state.url} /></View>} */}

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
//     alignItems: 'stretched',
  },
  bottom: {
    height: 50,
  },

	bottomIcon: {
		padding: 0
	},

  icon: {
    height: 30,
    width: 30
  },
  marginRight: {
    marginRight: 10
  },

	bottomText: {
		color: '#49ADAF'
	},
	marginLocation: {
		margin: 10,
		marginRight: 7,
	}
});
