import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, FlatList, Button, TouchableWithoutFeedback, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import InviteTabs from '../containers/InviteTabs'
import strings from '../res/values/strings'
import {themeColor} from '../res/values/styles'
import IntroLabel from '../components/IntroLabel'
import MeetingCard from '../components/MeetingCard'
import Meeting from '../state/models/meeting'
import MeetingDetailsScene from './MeetingDetailsScene'
import moment from 'moment'

const mapStateToProps = (state) => {
    return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

const UPCOMING = 0
const PAST = 1
const TABS = ["Upcoming", "Past"]

const TEST_MEETIGNS = { data: [
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019277",
      first_name: "Danil5",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-05-19 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15295
  },
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019277",
      first_name: "Danil4",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-04-19 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15297
  },
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019277",
      first_name: "Danil3",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-03-19 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15297
  },
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019277",
      first_name: "Danil6",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-06-19 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15290
  }
]}

@connect(mapStateToProps, mapDispatchToProps)
export default class CalendarScene extends Component {
	state = {
		activeTab: 0,
    upcomingMeetings: [],
    pastMeetings: [],
    selectedMeeting: null
	}
	_onTabPress = (i) => {

	}

    _onMeetingPress = (selectedMeeting) => {
      console.log(selectedMeeting)
      this.setState({selectedMeeting})
	}

    _onMeetingClose = () => {
      this.setState({selectedMeeting: null})
    }

    _onMeetingCancel = (cancelledMeeting) => {
      this.setState({upcomingMeetings: this.state.upcomingMeetings.filter((meeting) => meeting.suggestion_id != cancelledMeeting.suggestion_id)})
      this._onMeetingClose()
    }

  componentWillMount = () => {
    console.log('onComponentWillMount')
    this.props.appActions.loadScheduledMeetings().then((data) => {
      // data = TEST_MEETIGNS
      console.log(data)
      data = data.data.map((meeting) => new Meeting(meeting))
      data = data.filter((meeting) => meeting.canceled == 0)
      pastMeetings = data.filter((meeting) => meeting.isPast())
      pastMeetings.sort(function(a,b) {return (a.meeting_time < b.meeting_time)? 1 : ((b.meeting_time > a.meeting_time) ? -1 : 0);} );
      upcomingMeetings = data.filter((meeting) => !meeting.isPast())
      upcomingMeetings.sort(function(a,b) {return (a.meeting_time > b.meeting_time)? 1 : ((b.meeting_time < a.meeting_time) ? -1 : 0);} );
      this.setState({upcomingMeetings, pastMeetings})
    })
  }

  render() {
    let meetings = this.state.activeTab == UPCOMING? this.state.upcomingMeetings: this.state.pastMeetings

    if (!this.state.selectedMeeting) {
        return (
          <View style={styles.container}>
            <TopBar isMainScene>
              {TABS.map((title, i) => {
                let style = [styles.tab]
                if (i == this.state.activeTab) {
                  style.push(styles.selectedTab)
                }
                console.log(style)
                return <TouchableWithoutFeedback key={i} onPress={() => this.setState({activeTab: i})}>
                  <View><Text
                      style={style}>
                      {title}
                    </Text>
                    </View>
                  </TouchableWithoutFeedback>
              })}
            </TopBar>
            {!this.props.app.isIntroCalendarSeen && <IntroLabel
                                                        text={strings.introCalendar}
                                                        onClosePress={() => this.props.appActions.introCalendarSeen()}/>}
            <FlatList
              data={meetings}
              keyExtractor={this._keyExtractor}
              renderItem={({item}, i) => {
                return <MeetingCard
                            key={i}
                            meeting={item}
                            onPress={this._onMeetingPress}/>}} />
          </View>
        );
    }
    return <MeetingDetailsScene
              meeting={this.state.selectedMeeting}
              onClosePress={this._onMeetingClose}
              onMeetingCancel={this._onMeetingCancel}/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
//     alignItems: 'center',
    // backgroundColor: 'grey',
  },

  tab: {
//     fontFamily: 'OpenSans-Bold',
    margin: 20,
    color: themeColor,

  },

  selectedTab: {
      fontFamily: 'OpenSans-Bold',
  },

});
