import {
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import React, { Component } from 'react';
import Card from './Card'
import RemoteImage from './RemoteImage';
import s, { themeColorThird, themeColor, mainBackgroundColor, themeColorLight, greyColorLight, greyColor } from '../res/values/styles'

const borderWidth = 2

const CALENDAR_TIME_RANGE = 3 // hours

const KEYBOARD_BOTTOM_SPACING = 80 // spacing under the text-input and above the keyboard

export default class SuggestionsCard extends Component {
    state = {
        selected: [],
        isAcceptLoading: false,
        message: "",
    }

    _getStartTimes = () => {
        return this.props.suggestion.meeting_times
    }
    _getSelectedTimes = () => {
        var startTimes = this._getStartTimes()
        return this.state.selected.map((i) => startTimes[i].format("YYYY-MM-DD HH:mm:ss"))
    }
    _onTimeSelect = (i) => {
        let index = this.state.selected.indexOf(i);
        if (index != -1) {
            this.setState({selected: this.state.selected.filter((item) => item != i)})
        } else {
            if (this.props.suggestion.is_invite) {
              this.setState({selected: [i]})
            } else {
              this.setState({selected: [...this.state.selected, i]})
            }
        }
    }
    _isAllowed = () => {
      return this.state.selected.length > 0
    }
    _onConfirmPress = () => {
      if (!this._isAllowed()) {
        return
      }
      const message = this.state.message.length > 0 ? this.state.message : null;
      this.props.onConfirmPress(this.props.suggestion, this._getSelectedTimes(), message);
    }

    render () {
      var suggestion = this.props.suggestion
      const isInvite = (suggestion.is_invite == true)
      const isCall = (suggestion.meeting_type == "Call")
      var onMoreOptionsPress = this.props.onMoreOptionsPress
      var onShowLessPress = this.props.onShowLessPress
      var onConfirmPress = this.props.onConfirmPress
      var withOptions = this.props.withOptions
      var animateShowLess = this.props.animateShowLess
      console.log(suggestion)
      console.log(this.props);
      const calendarEvents = suggestion.events

      const timeButtons = this._getStartTimes().map((time, i) => {
          let style = [styles.timeSlot]
          const isSelected = this.state.selected.includes(i)
          if (isSelected) {
            style.push(styles.selectedTime)
          }
          return <TouchableWithoutFeedback key={i} onPress={() => this._onTimeSelect(i)}>
            <View style={[styles.row]}>
              <Text style={[style]}>
                {/* A - to add AM/PM */}
                {time.format("h:mm A")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        })

      const TIME_SLOTS_ROWS = 3
      let timeButtonsCols = timeButtons.reduce((currentCols, timeButton) => {
        if (currentCols.length > 0
          && currentCols[currentCols.length-1].length < TIME_SLOTS_ROWS) {
          currentCols[currentCols.length-1].push(timeButton)
        } else {
          currentCols.push([timeButton])
        }
        return currentCols
      }, []);

      while (timeButtonsCols.length < 2) {
        timeButtonsCols.push([<View key={"phantom"} style={styles.row}><Text style={[styles.timeSlot, {opacity: 0}]}/></View>])
      }

      console.log(timeButtonsCols)


      return (
        <Card>
          <View style={styles.container}>
            {isInvite && <View style={styles.highlight}></View>}
            <View>
              <View style={[styles.row]}>
                <View style={styles.header}>
                  {
                    isInvite ?
                    <Text style={[styles.smallTitle, {color: themeColorThird, fontWeight: "600"}]}>Invite from</Text>
                      :
                    <Text style={styles.smallTitle}>Send invite to</Text>
                  }
                  <Text style={styles.nameTitle}>{suggestion.friend.first_name} {suggestion.friend.last_name}</Text>
                </View>
                <RemoteImage
                  style={[styles.avatar, withOptions ? styles.avatarWithOptions : {}]}
                  source={{ uri: suggestion.friend.image}}/>
                { withOptions &&
                  <View style={styles.showLessWrapper}>
                    {animateShowLess &&
                      <ActivityIndicator animating={true} color={themeColor} size="small" style={styles.activityIndicator}/>
                    }
                    {!animateShowLess &&
                      <IconEvil.Button
                        name="close"
                        backgroundColor="#fff"
                        size={22}
                        color="#BBBBBB"
                        onPress={() => this.props.onShowLessPress(suggestion)}
                      />
                    }
                  </View>
                }
              </View>
              <View style={[styles.header, {marginBottom: 10, marginLeft: 15, marginTop: 0, alignItems: 'baseline'}]}>
                <Text style={styles.smallTitle}>{isCall ? "For a" : "For"}</Text>
                <Text style={styles.nameTitle}>{suggestion.meeting_type}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.row, s.flex, s.border]}>
            <View style={[styles.scheduleWrapper]}>
              <Text style={[styles.smallTitle, {marginLeft: 15, alignSelf: 'flex-start'}]}>
                {suggestion.getDateStr()}
              </Text>
              <View style={[s.row, s.margin10, {marginRight: 5}]}>
                {timeButtonsCols.map((col, i) =>
                  <View key={i} style={[s.col, styles.timeSlotsCol]}>
                    {col}
                  </View>
                )}
              </View>
            </View>
            <View style={[styles.scheduleWrapper, styles.calendarStyle]}>
              <Text style={[styles.calendarTextSize, s.textColorGrey, {marginLeft: 20, marginBottom: 5}]}>Your calendar</Text>
              <View style={styles.column}>
                {
                  calendarEvents.length > 0 ?
                  calendarEvents.map((event, i) => {
                    console.log(event)
                    const canShorten = (event.begin.format("A") === event.end.format("A"))
                    const startTime = event.begin.format(canShorten ? "h:mm" : "h:mm A")
                    const endTime = event.end.format("h:mm A")
                    return <View key={i} style={[styles.calendarWrapper]}>
                      <View style={[styles.column]}>
                        <Text style={[s.bold]}>
                          {startTime} - {endTime}
                        </Text>
                        <Text style={[s.textColorGrey, s.marginRight10]}>
                          {event.name}
                        </Text>
                      </View>
                    </View>
                  })
                  : <View key={"No events"} style={[styles.calendarWrapper]}>
                    <Text style={[s.textColorGrey]}>No events</Text>
                  </View>
                }
              </View>
            </View>
          </View>
          {isInvite && suggestion.message &&
            <View style={[s.row, s.padding15]}>
              <RemoteImage
                style={styles.smallAvatar}
                source={{uri: suggestion.friend.image}}
              />
              <Text style={[s.semibold, s.textColorGrey, s.marginLeft10, {fontSize: 12}]}>
                {suggestion.message}
              </Text>
            </View>
          }
          {!isInvite &&
            <TextInput
              style={styles.messageInput}
              underlineColorAndroid='transparent'
              onChangeText={(text) => this.setState({message: text})}
              onFocus={() => this.props.onInputFocus(KEYBOARD_BOTTOM_SPACING)}
              value={this.state.message}
              placeholder={"  Write a message..."}
            />
          }
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
            { withOptions && <View style={styles.verticalBorder}></View> }
            <TouchableHighlight
              style={styles.buttonWrapper}
              underlayColor={themeColorLight}
              disabled={!this._isAllowed()}
              onPress={() => this._onConfirmPress()}>
              <View>
                <Text style={[styles.optionButton,  {color: this._isAllowed()? themeColorThird: '#C0C0C0'} ]}>
                  {isInvite ? "Yes" : "Send"}
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
    nameTitle: {
      fontSize: 22,
      fontFamily: 'OpenSans-ExtraBold',
      color: 'rgb(74, 74, 74)',
    },
    smallTitle: {
      fontSize: 14,
      fontFamily: 'OpenSans-SemiBold',
      color: themeColor,
    },
    typeTitle: {
      fontSize: 22,
      fontFamily: 'OpenSans-ExtraBold',
      color: 'rgb(74, 74, 74)',
    },
    header: {
      flex: 1,
      alignItems: 'stretch',
      marginRight: 20,
      marginLeft: 15,
      marginTop: 10,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginTop: 15,
      marginRight: 15,
    },
    type: {
      width: 40,
      height: 40,
      marginLeft: 10,
      marginRight: 10,
    },
    scheduleWrapper: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      paddingTop: 5
    },
    textSize: {
      fontSize: 8
    },
    calendarTitle: {
      color: themeColor,
      fontFamily: 'OpenSans-Bold',
    },
    calendarStyle: {
      flex: 1,
      borderLeftWidth: 1,
      borderLeftColor: greyColorLight,
      borderStyle: 'solid'
    },

    timeSlotsCol: {
      alignItems: "stretch"
    },

    timeSlot: {
      borderColor: greyColor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 20,
      fontSize: 14,
      fontFamily: 'OpenSans-ExtraBold',
      width: 78,
      alignItems: 'center',
      margin: 5,
      marginLeft: 0,
      padding: 10,
      paddingLeft: 0,
      paddingRight: 0,
      textAlign: 'center'
    },

    calendarWrapper: {
      backgroundColor: greyColorLight,
      borderColor: greyColorLight,
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 8,
      margin: 10,
      padding: 10
    },
    column: {
      flexDirection: 'column',
      justifyContent: 'flex-start',

    },
    selectedTime: {
      backgroundColor: themeColorThird,
      borderColor: themeColorThird,
      overflow: 'hidden',
      color: 'white'
    },
    checkmark: {
      position: 'absolute',
      left: 0,
      borderRadius: 0,
      borderStyle: 'solid',
      borderColor: 'grey',
      borderWidth: 1,
      paddingLeft: 2,
    },

    buttonWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 58,
    },
    optionButton: {
      color: themeColor,
      textAlign: 'center',
      padding: 10,
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: 16,
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
      marginRight: 10,
      padding: 9,
    },
    highlight: {
      height: 6,
      backgroundColor: themeColorThird,
    },
    smallAvatar: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    messageWrapper: {
      padding: 20,
    },
    showLessWrapper: {
      alignSelf: 'flex-start',
      marginRight: -10,
    },
    avatarWithOptions: {
      marginRight: 0,
      marginTop: 20,
    },
    messageInput: {
      height: 40,
      borderRadius: 10,
      backgroundColor: 'rgb(248, 248, 248)',
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 10,
      fontFamily: 'OpenSans-SemiBold',
      fontSize: 12,
    }
});
