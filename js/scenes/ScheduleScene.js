import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, TouchableWithoutFeedback, Image, ScrollView, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, NativeModules, ActivityIndicator } from 'react-native'
import * as appActions from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import SuggestionCard from '../components/SuggestionCard'
import {getDay, getMonth} from '../utils/DateTime'
import {getEvents} from '../utils/Calendar'
import { themeColor, mainBackgroundColor } from '../res/values/styles'
import dateFormat from 'dateformat'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationTopBar from '../components/NavigationTopBar';
import IconEntypo from 'react-native-vector-icons/Entypo';
import { NavigationActions } from 'react-navigation'
import s, { themeColorThird } from '../res/values/styles'
import {IS_TEST_SUGGESTIONS, IS_IOS} from '../settings'
import RemoteImage from '../components/RemoteImage';

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

const TOTAL_OPTIONS = 6
const CALENDAR_TIME_RANGE = 3 // hours

@connect(mapStateToProps, mapDispatchToProps)
export default class ScheduleScene extends Component {

    state = {
      calendarEvents: [],
      isCalendarEventsLoaded: false,
      selected: [],
			isAcceptLoading: false
    }

    _onConfirmPress = () => {
      if (this.state.isConfirming) {
        return;
      }
			const rootSuggestion = this.props.rootSuggestion
      if (this.state.selected.length > 0) {
        startTimes = this._getStartTimes()
        times = this.state.selected.map((i) => startTimes[i].format("YYYY-MM-DD HH:mm:ss"))
        console.log(times)
				if (IS_TEST_SUGGESTIONS) {
					this.props.navigation.goBack()
					this.props.onScheduleMeeting()
					return
				}
				if (this.state.isAcceptLoading) {
					return
				}

				this.setState({isAcceptLoading: true})
        this.props.appActions.acceptSuggestion(this.props.suggestion, times).then((data) => {
          this.setState({isAcceptLoading: false})
          this.props.appActions.removeSuggestion(this.props.suggestion)
					// Refresh confirmed-meetings
          this.props.appActions.calendarLoading();
          this.props.appActions.loadScheduledMeetings();
          // If we came here via 'more options', reject the root suggestion.
          if (rootSuggestion) {
            this.props.appActions.rejectSuggestion(rootSuggestion, 'another-time').then(() => {
              this.props.appActions.loadSuggestions()
            })
          } else {
            this.props.appActions.loadSuggestions()
          }
          setTimeout(() => {
            if (this.props.onScheduleMeeting) {
              this.props.onScheduleMeeting();
            }
          }, 300);
          this._navigateBack();
        }).catch((err) => {
          this.setState({isConfirming: false})
        })
      }
    }

    _navigateBack = () => {
      const skipBack = this.props.skipBack
      this.props.navigation.dispatch(NavigationActions.back({
        key: skipBack
      }))
    }

    _getStartTimes = () => {
      result = []
      let currentDate = this.props.suggestion.meeting_time
      for (var i = 0; i < TOTAL_OPTIONS; i++) {
        result.push(currentDate)
        currentDate = currentDate.clone().add(30, 'm')
      }
      return result
    }

    _loadCalendarEvents = () => {
      console.log('_loadCalendarEvents')
      console.log(this.props.suggestion.meeting_time)
			dateStart = this.props.suggestion.meeting_time.clone().subtract(1, 'h')
      dateEnd = this.props.suggestion.meeting_time.clone().add(CALENDAR_TIME_RANGE + 1, 'h')
      console.log(dateEnd)
      getEvents(dateStart, dateEnd).then(events => {
            // handle events
            console.log('Calendar')
            console.log(events)
						const filteredEvents = events.filter((event) => !event.allDay)
            this.setState({calendarEvents: filteredEvents,
                          isCalendarEventsLoaded: true})
          })
          .catch(error => {
            console.log(error)
            this.props.appActions.switchPermissionsOff()
           // handle error
          });
    }
    _onTimeSelect = (i) => {
      let index = this.state.selected.indexOf(i);
      if (index != -1) {
          this.setState({selected: this.state.selected.filter((item) => item != i)})
      } else {
          this.setState({selected: [...this.state.selected, i]})
      }
    }

    _isSelected = () => {

    }

  componentDidUpdate() {
    // Prevent accepting an expired suggestion.
    if (this.props.app.isSuggestionsLoading) {
      this._navigateBack();
    }
  }

  render() {
    this.props = {...this.props, ...this.props.navigation.state.params}
		console.log(this.props)
    if (!this.state.isCalendarEventsLoaded) {
      this._loadCalendarEvents()
    }

    const suggestion = this.props.suggestion
    console.log(suggestion)
    let buttonStyles = [styles.confirmButtonWrapper]

    if (this.state.selected.length > 0 && !this.state.isAcceptLoading) {
      buttonStyles.push(styles.buttonActive)
    }
    return (
      <View style={styles.container}>
        <NavigationTopBar navigation={this.props.navigation} />
        <View style={styles.topWrapper}>
          <View style={styles.row}>
            <Text style={[styles.title, styles.textSize]}>
              {suggestion.meeting_type} with {suggestion.friend.first_name} {suggestion.friend.last_name}{"\n"}When works for you?
            </Text>
            <RemoteImage
                style={styles.avatar}
                source={{ uri: suggestion.friend.image}}/>
          </View>
          <View style={styles.row}>
            <Text style={[styles.time, s.textColorBlack]}>
              {suggestion.getDateStr()}
            </Text>
          </View>
        </View>
        <View style={[styles.row, s.borderTop, s.flex, s.border]}>
          <View style={[styles.scheduleWrapper, styles.calendarStyle]}>
            <Text style={[styles.calendarTitle, styles.textSize]}>my calendar</Text>
            <ScrollView>
            {
            this.state.calendarEvents.map((event, i) => {
              console.log(event)
              startTime = moment(event.startDate).format("h:mm A")
              endTime = moment(event.endDate).format("h:mm A")
              return <View key={i} style={[styles.timeWrapper]}>
                <IconEntypo name="dot-single" style={{justifyContent: 'flex-start', borderWidth: 0, margin: -8}} size={35} color={themeColor} />
                <View style={[styles.column]}>
                  <Text style={[s.bold]}>
                      {startTime} - {endTime}
                  </Text>
                  <Text style={[s.marginRight10]}>
                    {event.title}
                  </Text>
                 </View>
              </View>
            })
            }
            </ScrollView>
          </View>
          <View style={styles.scheduleWrapper}>
            <Text style={[styles.timesTitle, styles.textSize, s.bold, s.textColorBlack]}>start times</Text>
            <ScrollView>
            {
            this._getStartTimes().map((time, i) => {
              let style = [styles.timeWrapper, styles.timeBorder]
              const isSelected = this.state.selected.includes(i)
              if (isSelected) {
                style.push(styles.selectedTime)
              }
              return <TouchableWithoutFeedback key={i} onPress={() => this._onTimeSelect(i)}>
                <View style={[styles.row, styles.timeRow]}>
                  <Text style={[style]}>
                    {time.format("h:mm A")}
                  </Text>
                  <Icon style={styles.checkmark} name="md-checkmark" size={20} color={isSelected? "#139A9C": "#fff"} />
                </View>
              </TouchableWithoutFeedback>
            })
            }
            </ScrollView>
          </View>
        </View>

        <TouchableHighlight  style={styles.row} onPress={this._onConfirmPress}>
          <View style={buttonStyles}>
            {!this.state.isConfirming &&
              <Text style={styles.confirmButton}>Sounds Good!</Text>
            }
            {this.state.isConfirming &&
              <ActivityIndicator animating={true} color="white" size="small"/>
            }
          </View>
          </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  topWrapper: {
    alignSelf: 'stretch',
    margin: 10
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      alignSelf: 'stretch',
    },
	timeRow: {
		width: 130,
		justifyContent: 'center',
	},
  title: {
      flex: 1,
      margin: 10,
			marginTop: 0,
      fontFamily: 'OpenSans-Bold',
      color: 'black'
    },
  time: {
    marginLeft: 10,
    fontSize: 15,
    marginBottom: 13
  },
  avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
  scheduleWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingTop: 5
  },
  textSize: {
    fontSize: 17
  },
  calendarTitle: {
    color: themeColor,
    fontFamily: 'OpenSans-Bold',
  },
  calendarStyle: {
    backgroundColor: '#F8F8F8'
  },

	timeBorder: {
		borderColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 20,
		fontSize: 16
	},

  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 10,
    padding: 7,
		paddingLeft: 10,
		paddingRight: 10,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',

  },
  selectedTime: {
    backgroundColor: '#BADFDF',
    borderColor: '#139A9C',
		overflow: 'hidden',
  },
	confirmButtonWrapper: {
    height: 50,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8CCACA'
  },
	checkmark: {
		position: 'absolute',
		right: 0
	},
  confirmButton: {
    color: 'white',
    fontSize: 16,
  },
  buttonActive: {
     backgroundColor: themeColorThird
  }
});
