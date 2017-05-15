import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
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

    }

	componentWillMount = () => {

	}
    
    _keyExtractor = (item, index) => item.id;

  render() {
    const meeting = this.props.meeting
    console.log(this.props)
      return (
        <Card style={{flex: 1}}>
          <IconEvil.Button name="close" backgroundColor="#fff" size={25} color="#A0A0A0" onPress={() => this.props.onClosePress(meeting)} />
          <View style={[s.row, s.margin10]}>
             <View style={[s.column, s.flex]}>
                  <Text style={[s.textThemeColor, s.bold]}>{meeting.meeting_type} with {meeting.friend.first_name} {meeting.friend.last_name}</Text>
                  <Text style={s.marginTop10}>{meeting.getDateStr()}</Text>
              </View>
            <Image
                style={[s.avatar]}
                source={{ uri: meeting.friend.image }}/>
          </View>
          <View style={[s.column, s.borderTop, s.padding10, s.flex]}>
            <View style={[s.row, s.alignItemsCenter]}>
              <Text style={[s.flex, s.marigin10]}>{meeting.meeting_time.format("h:mm A")}</Text>
              <IconIon name="ios-time-outline" style={s.margin10} size={30} backgroundColor="#fff" color="#535353" />
            </View>
            <View style={[s.row, s.alignItemsCenter]}>
              <Text style={[s.flex, s.marigin10]}>Home</Text>
              <IconEvil name="location" style={s.margin10} size={30} backgroundColor="#fff" color="#535353" />
            </View>
            <View style={[s.row, s.alignItemsCenter]}>
              <Text style={[s.flex, s.marigin10]}>Message on Facebook</Text>
              <Image
                style={styles.topBarIcon}
                source={require('../res/images/fb-icon-66px.png')}/>
            </View>
            <View style={[s.row]}>
              <Text></Text>
            </View>
          </View> 
          <View style={[styles.bottom, s.row, s.borderTop]}>
            <Text>Reschedule</Text>
          </View>
        </Card>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
//     alignItems: 'stretched',
  },
  
  bottom: {
    height: 20,
  },
  
  borderTop: {
    borderTopColor: 'grey',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  
  topBarIcon: {
    height: 40,
    width: 40
  },
  marginRight: {
    marginRight: 10
  }
});
