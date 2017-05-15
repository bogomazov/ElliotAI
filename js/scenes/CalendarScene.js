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
      this.setState({selectedMeeting})
	}
    
    _onMeetingClose = () => {
      this.setState({selectedMeeting: null})
    }
  
    
  componentWillMount = () => {
    console.log('onComponentWillMount')
    this.props.appActions.loadScheduledMeetings().then((data) => {      
      data = data.data.map((item) => new Meeting(item))
      this.setState({upcomingMeetings: data.filter((event) => moment() <= event.meeting_time),
                     pastMeetings: data.filter((event) => moment() > event.meeting_time)})
    })
  }

  render() {
    let meetings = this.state.activeTab == UPCOMING? this.state.upcomingMeetings: this.state.pastMeetings
    
    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          {TABS.map((title, i) => {
            
            let style = [styles.tab]
            
            if (i == this.state.activeTab) {
              style.push(styles.selectedTab)
            }
            console.log(style)
            return <TouchableWithoutFeedback key={i}>
              <View><Text
                  style={style}>
                  {title}
                </Text>
                </View>
              </TouchableWithoutFeedback>            
          })}
        </TopBar>
        {!this.props.app.isIntroCalendarSeen && <IntroLabel 
                                                    text={string.introCalendar}
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
