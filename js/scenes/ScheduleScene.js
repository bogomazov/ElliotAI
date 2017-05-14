import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, TouchableWithoutFeedback, Image, ScrollView, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
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

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

const TOTAL_OPTIONS = 6

@connect(mapStateToProps, mapDispatchToProps)
export default class ScheduleScene extends Component {
  
    state = {
      calendarEvents: [],
      isCalendarEventsLoaded: false,
      selected: []
    }
    
	componentWillMount = () => {
//       if (!this.state.isUserSuggestionsLoaded) {
//       this.props.appActions.loadUserSuggestions(this.props.suggestion.friend.fb_id).then((data) => {
//           console.log(data)
//           this.setState({userSuggestions: data, isUserSuggestionsLoaded: true})
//         }).catch((err) => console.log(err))
    }
    
    
    _onConfirmPress = () => {
      if (this.state.selected.length > 0) {
        startTimes = this._getStartTimes()
        times = this.state.selected.map((i) => startTimes[i]._i)
        console.log(times)
        this.props.appActions.acceptSuggestion(this.props.suggestion, times).then((data) => {
          this.props.removeSuggestion(this.props.suggestion)
          this.props.navigation.goBack()
        })
      }
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
      dateEnd = this.props.suggestion.meeting_time.clone().add(2, 'h')
      console.log(dateEnd)
      getEvents(this.props.suggestion.meeting_time, this.props.suggestion.meeting_time.clone().add(2, 'hours')).then(events => {
            // handle events
            console.log('Calendar')
            console.log(events)
            this.setState({calendarEvents: events,
                          isCalendarEventsLoaded: true})
          })
          .catch(error => {
            console.log(error)
            this.props.appActions.switchPermissionsOff()
           // handle error
          });
      console.log(dateEnd)
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

  render() {
    this.props = {...this.props, ...this.props.navigation.state.params}
    
    if (!this.state.isCalendarEventsLoaded) {
      this._loadCalendarEvents()
    }
	console.log(this.props)

    const suggestion = this.props.suggestion
    console.log(suggestion)
    let buttonStyles = [styles.confirmButtonWrapper]
    
    if (this.state.selected.length > 0) {
      buttonStyles.push(styles.buttonActive)
    }
    return (
      <View style={styles.container}>
        <NavigationTopBar navigation={this.props.navigation} />
        <View style={styles.topWrapper}>
          <View style={styles.row}>
            <Text style={[styles.title, styles.textSize]}>
              {suggestion.meeting_type} with {suggestion.friend.first_name} {suggestion.friend.last_name.charAt(0)}.{"\n"}When works for you?
            </Text>
            <Image
                style={styles.avatar}
                source={{ uri: suggestion.friend.image}}/>
          </View>
          <View style={styles.row}>
            <Text style={[styles.time, styles.textSize]}>
              {suggestion.getDateStr()}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.borderTop]}>
          <View style={[styles.scheduleWrapper, styles.calendarStyle]}>
            <Text style={[styles.calendarTitle, styles.textSize]}>calendar</Text>
            <ScrollView>
            {
            this.state.calendarEvents.map((event, i) => {
              return <View key={i} style={styles.timeWrapper}>
                <Text style={[styles.textSize]}>
                  hello!
                </Text>
              </View>
            })
            }
            </ScrollView>
          </View> 
          <View style={styles.scheduleWrapper}>
            <Text style={[styles.timesTitle, styles.textSize]}>start times</Text>
            <ScrollView>
            {
            this._getStartTimes().map((time, i) => {
              let style = [styles.timeWrapper]
              const isSelected = this.state.selected.includes(i)
              if (isSelected) {
                style.push(styles.selectedTime)
              }
              return <TouchableWithoutFeedback key={i} onPress={() => this._onTimeSelect(i)}>
                <View style={styles.row}>
                  <Text style={[style, styles.textSize]}>
                    {time.format("h:mm A")}
                  </Text>
                  <Icon name="md-checkmark" size={20} color={isSelected? "#3F9696": "#fff"} />
                </View>
              </TouchableWithoutFeedback>
            })
            }
            </ScrollView>
          </View>
        </View>

         <TouchableHighlight  style={styles.row} onPress={this._onConfirmPress}>
           <View style={buttonStyles}>
              <Text style={styles.confirmButton}>Sounds Good!</Text>
            </View>
         
          </TouchableHighlight>
      </View>
    );
  }
}       

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
  title: {
      flex: 1,
      marginRight: 20,
      margin: 10,
      fontFamily: 'OpenSans-Bold',
      color: 'black'
    },
  time: {
    marginLeft: 10,
    fontSize: 16,
    marginBottom: 20
  },
  avatar: {
      width: 45,
      height: 45,
      borderRadius: 100,
      marginRight: 20,
    },
  borderTop: {
    borderTopColor: themeColor,
    borderTopWidth: 3,
    borderStyle: 'solid',
    flex: 1,
    alignItems: 'flex-start',
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
    fontSize: 20
  },
  calendarTitle: {
    color: themeColor,
    fontFamily: 'OpenSans-Bold',
  },
  timesTitle: {
    fontFamily: 'OpenSans-Bold',
    color: 'black'
  },
  calendarStyle: {
    backgroundColor: '#F8F8F8'
  },
  confirmButtonWrapper: {
    height: 50,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8CCACA'
  },
  confirmButton: {
    color: 'white',
    fontSize: 18,
  },
  timeWrapper: {
    margin: 10,
    padding: 10
  },
  selectedTime: {
    backgroundColor: '#BADFDF',
    borderColor: '#3F9696',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 20
  },
  buttonActive: {
     backgroundColor: '#3F9696'
  }
});
