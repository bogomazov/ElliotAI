import { StyleSheet, ScrollView, TouchableWithoutFeedback, Image, Button, Text, View, TextInput, TouchableHighlight, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import moment from 'moment'
import Card from './Card'
import CustomButton from './CustomButton'
import {getEvents} from '../utils/Calendar'
import strings from '../res/values/strings'
import s, { themeColorThird, themeColor, mainBackgroundColor, themeColorLight } from '../res/values/styles'
import RemoteImage from './RemoteImage';

const borderWidth = 2

const CALENDAR_TIME_RANGE = 3 // hours

export default class SuggestionsCard extends Component {
    state = {
        calendarEvents: [],
        isCalendarEventsLoaded: false,
        selected: [],
        isAcceptLoading: false
    }

    _getStartTimes = () => {
        return this.props.suggestion.meeting_times
    }
    _getSelectedTimes = () => {
        var startTimes = this._getStartTimes()
        return this.state.selected.map((i) => startTimes[i].format("YYYY-MM-DD HH:mm:ss"))
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

    render () {
      var suggestion = this.props.suggestion
      var onMoreOptionsPress = this.props.onMoreOptionsPress
      var onShowLessPress = this.props.onShowLessPress
      var onConfirmPress = this.props.onConfirmPress
      var withOptions = this.props.withOptions
      var animateShowLess = this.props.animateShowLess
      console.log(suggestion)

      if (!this.state.isCalendarEventsLoaded) {
        this._loadCalendarEvents()
      }

      return (
        <Card>
          <View style={styles.container}>
            {suggestion.is_invite == true && <View style={styles.highlight}></View>}
            <View>
              <View style={styles.row}>
                <Text style={styles.title}>{suggestion.meeting_type} with {suggestion.friend.first_name} {suggestion.friend.last_name}</Text>
                <RemoteImage
                  style={styles.avatar}
                  source={{ uri: suggestion.friend.image}}/>
              </View>
              <View style={styles.row}>
                <Image
                  style={styles.type}
                  source={suggestion.getIcon()}/>
                <Text style={styles.date}>{suggestion.getDateStr()}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.row, s.borderTop, s.flex, s.border]}>
            <View style={styles.scheduleWrapper}>
              <Text style={[styles.textSize, s.bold, s.textColorBlack]}>start times</Text>
              <ScrollView>
                {
                  this._getStartTimes().map((time, i) => {
                    let style = [styles.timeWrapper, styles.timeBorder]
                    const isSelected = this.state.selected.includes(i)
                    if (isSelected) {
                      style.push(styles.selectedTime)
                    }
                    return <TouchableWithoutFeedback key={i} onPress={() => this._onTimeSelect(i)}>
                      <View style={[styles.row]}>
                        <Icon style={styles.checkmark} name="md-checkmark" size={22} color={isSelected? "#139A9C": "#fff"} />
                        <Text style={[style]}>
                          {time.format("h:mm A")}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  })
                }
              </ScrollView>
            </View>
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
          </View>
          <View style={[styles.row, styles.buttonOptionsWrapper]}>
            { withOptions &&
            <TouchableHighlight style={styles.buttonWrapper} underlayColor={themeColorLight}
                                onPress={() => onMoreOptionsPress(suggestion)}>

              <View>
                <Text style={styles.optionButton}>
                  More Options
                </Text>
              </View>
            </TouchableHighlight>
            }
            { withOptions && < View style={styles.verticalBorder} ></View> }
            { withOptions &&
              <TouchableHighlight style={styles.buttonWrapper} underlayColor={themeColorLight}
                                  onPress={() => onShowLessPress(suggestion)}>
                <View>
                  {animateShowLess &&
                  <ActivityIndicator animating={true} color={themeColor} size="small" style={styles.activityIndicator}/>
                  }
                  {!animateShowLess &&
                  <Text style={styles.optionButton}>
                    Show Less of {suggestion.friend.first_name}
                  </Text>
                  }
                </View>
              </TouchableHighlight>
            }
            { withOptions && < View style={styles.verticalBorder} ></View> }
            <TouchableHighlight style={styles.buttonWrapper} underlayColor={themeColorLight}
                                onPress={() => onConfirmPress(suggestion, this._getSelectedTimes())}>
              <View>
                <Text style={styles.optionButton}>
                  YES!
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </Card>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignSelf: 'stretch',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
    },

    date: {
      fontFamily: "OpenSans-Light",
      fontSize: 17
    },
    title: {
      flex: 1,
      margin: 10,
      marginLeft: 15,
      marginRight: 20,
      fontSize: 17,
      fontFamily: 'OpenSans-Bold',
      color: 'black'
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginTop: 10,
      marginRight: 30,
    },
    type: {
      width: 50,
      height: 50,
      margin: 10
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
      marginLeft: 20,
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
    checkmark: {
      position: 'absolute',
      left: 0,
      borderRadius: 0,
      borderStyle: 'solid',
      borderColor: 'grey',
      borderWidth: 1,
      paddingLeft: 2,
      // paddingRight: 0,
      // padding: 0
    },

    buttonWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 58,
    },
    optionButton: {
//       flexDirection: 'row',
      color: themeColor,
      textAlign: 'center',
      padding: 10,
      fontFamily: 'OpenSans-Bold'
    },
    verticalBorder: {
      width: borderWidth,
      height: '100%',
      backgroundColor: mainBackgroundColor,
    },
    buttonOptionsWrapper: {
      borderTopColor: mainBackgroundColor,
      borderTopWidth: borderWidth,
      borderStyle: 'solid',
    },
    activityIndicator: {
      flex: 1,
  		justifyContent: 'center',
  		alignItems: 'center',
    },
    highlight: {
      height: 6,
      backgroundColor: themeColorThird,
    }
});
