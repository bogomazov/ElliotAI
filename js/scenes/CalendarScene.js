import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, FlatList, Button, TouchableWithoutFeedback, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, AppState } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import InviteTabs from '../containers/InviteTabs'
import strings from '../res/values/strings'
import {themeColor} from '../res/values/styles'
import IntroLabel from '../components/IntroLabel'
import MeetingCard from '../components/MeetingCard'
import Meeting from '../state/models/meeting'
import moment from 'moment'
import {saveEvent, removeEvent} from '../utils/Calendar';

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



@connect(mapStateToProps, mapDispatchToProps)
export default class CalendarScene extends Component {
	state = {
		activeTab: 0,
    upcomingMeetings: [],
    pastMeetings: [],
    selectedMeeting: null,
		isRefreshing: false,
    appState: AppState.currentState,
	}

  componentWillMount = () => {
    console.log('Calendar Will Mount');
    if (this.props.app.calendarBadges > 0) {
      this.props.appActions.setCalendarBadges(0)
      this.props.appActions.resetBadges()
    }
  }

  // MARK - on-resume detection
  componentDidMount = () => {
    AppState.addEventListener('change', this._onAppStateChange)
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this._onAppStateChange)
  }

  _onAppStateChange = (nextAppState) => {
    // show upcoming tab when app is resumed
    this.setState({activeTab: UPCOMING});
  }

	_onTabPress = (i) => {

	}

  _onMeetingPress = (selectedMeeting) => {
    console.log(selectedMeeting)
    console.log(this.props)
    this.props.navigation.navigate('MeetingDetailsScene', {
      meeting: selectedMeeting,
      onMeetingCancel: this._onMeetingCancel})
	}

    _onMeetingClose = () => {
      this.setState({selectedMeeting: null})
    }

    _onMeetingCancel = (cancelledMeeting) => {
      this.setState({upcomingMeetings: this.state.upcomingMeetings.filter((meeting) => meeting.suggestion_id != cancelledMeeting.suggestion_id)})
      // Refresh suggestions to let user reschedule the cancelled event.
      this.props.appActions.loadSuggestions();
    }

  _refresh = () => {
    this.props.appActions.calendarLoading()
		this.props.appActions.loadScheduledMeetings()
	}

  render() {
    let meetings = this.state.activeTab == UPCOMING? this.props.app.upcomingMeetings: this.props.app.pastMeetings
    // let meetings = this.state.activeTab == UPCOMING? this.props.app.upcomingMeetings: this.props.app.pastMeetings
    // meetings = TEST_MEETINGS.data.map((item) => new Meeting(item));
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
              <View>
                <Text
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
          onRefresh={this._refresh}
					refreshing={this.props.app.isCalendarLoading}
          data={meetings}
          keyExtractor={(item, index) => item.suggestion_id}
          renderItem={({item}, i) => {
            console.log(i)
            return <View key={i}>
                      <MeetingCard
                            meeting={item}
                            onPress={this._onMeetingPress}/>
                    </View>}} />
      </View>
    );
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
    fontSize: 16,
  },

  selectedTab: {
      fontFamily: 'OpenSans-Bold',
  },

});

export const TEST_MEETINGS = { data: [
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019279",
      first_name: "Danil5 Long Middle A Name",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andreysd"
    },
    meeting_time: "2017-03-19 16:00:00",
    meeting_type: "Call",
    suggestion_id: 15295
  },
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019277",
      first_name: "Danil4 sdfasdfsdffdsf",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-06-18 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15297
  },
  {
    canceled: 0,
    friend: {
      fb_id: "2116462060192",
      first_name: "Danil3",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-03-19 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15299
  },
  {
    canceled: 0,
    friend: {
      fb_id: "2116462060192r7",
      first_name: "Danil6",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-06-19 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15293
  },
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019277",
      first_name: "Danil7",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-07-19 17:00:00",
    meeting_type: "Call",
    suggestion_id: 15290
  }
]}
