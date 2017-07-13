import {NavigationActions} from 'react-navigation';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  AppState,
} from 'react-native';
import React, { Component } from 'react'
import {connectToApp} from '../utils/ReduxConnect';
import {themeColor} from '../res/values/styles'
import CalendarTopNavigator from './CalendarTopNavigator';
import IntroLabel from '../components/IntroLabel'
import TopBar from '../components/TopBar'
import strings from '../res/values/strings'

const UPCOMING = 0
const PAST = 1
const TABS = ["Upcoming", "Past"]



@connectToApp
export default class CalendarScene extends Component {
  state = {
    activeTab: 0,
  }

  componentWillMount = () => {
    console.log('Calendar Will Mount');
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
    this.setActiveTab(UPCOMING);
  }

  setActiveTab = (index) => {
    this.setState({activeTab: index}, () => {
      this.topNavigator.dispatch(NavigationActions.navigate({
        routeName: index === UPCOMING ? 'UpcomingTab' : 'PastTab',
      }));
    });
  }

  _onMeetingPress = (selectedMeeting) => {
    console.log(selectedMeeting)
    console.log(this.props)
    this.props.navigation.navigate('MeetingDetailsScene', {
      meeting: selectedMeeting,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          {TABS.map((title, i) => {
            let style = [styles.tab]
            if (i == this.state.activeTab) {
              style.push(styles.selectedTab)
            }
            console.log(style)
            return <TouchableWithoutFeedback key={i} onPress={() => this.setActiveTab(i)}>
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
        <CalendarTopNavigator
          ref={ref => this.topNavigator = ref}
          screenProps={{onMeetingPress: this._onMeetingPress}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  tab: {
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
    meeting_type: "Lunch",
    suggestion_id: 15295
  },
  {
    canceled: 0,
    friend: {
      fb_id: "211646206019279",
      first_name: "Danil5 Long Middle A Name",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andreysd"
    },
    meeting_time: "2017-10-19 20:00:00",
    meeting_type: "Call",
    suggestion_id: 153
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
    meeting_type: "Lunch",
    suggestion_id: 15290
  }
]}
