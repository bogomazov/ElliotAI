import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import SuggestionCard from '../components/SuggestionCard'
import {getDay, getMonth} from '../utils/DateTime'
import { themeColor, mainBackgroundColor } from '../res/values/styles'
import dateFormat from 'dateformat'

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ScheduleScene extends Component {
  
    state = {
      userSuggestions: [],
      isUserSuggestionsLoaded: false,
      selected: []
    }
    
	componentWillMount = () => {
	}
    
    
    _onConfirmPress = () => {
      
    }

  render() {
	console.log(this.props)
    this.props = {...this.props, ...this.props.navigation.state.params}

    const suggestion = this.props.suggestion
    console.log(suggestion)
    console.log(this.state.userSuggestions)
    if (!this.state.isUserSuggestionsLoaded) {
      this.props.appActions.loadUserSuggestions(this.props.suggestion.friend.fb_id).then((data) => {
          console.log(data)
          this.setState({userSuggestions: data, isUserSuggestionsLoaded: true})
        }).catch((err) => console.log(err))
    }
    
    return (
      <View style={styles.container}>
        <TopBar>
          <Image
            style={styles.topBarIcon}
            source={require('../res/images/Icon-50.png')}/>
        </TopBar>
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
              {getDay(suggestion.meeting_time)}, {getMonth(suggestion.meeting_time)} {suggestion.meeting_time.getDate()}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.borderTop]}>
          <View style={[styles.scheduleWrapper, styles.calendarStyle]}>
            <Text style={[styles.calendarTitle, styles.textSize]}>calendar</Text>
          </View> 
          <View style={styles.scheduleWrapper}>
            <Text style={[styles.timesTitle, styles.textSize]}>start times</Text>
            {
            this.state.userSuggestions.map((meeting, i) => {
              const isSelected = this.state.selected.indexOf(i) != -1
              console.log(meeting)
              console.log('cje')
              return <View key={i} style={styles.timeWrapper}>
                <Text style={[styles.textSize]}>
                  {dateFormat(new Date(meeting.meeting_time), "h:MM TT")}
                </Text>
              </View>
            })
            }
          </View>
        </View>

         <TouchableHighlight  style={styles.row} onPress={this._onConfirmPress}>
            <View style={styles.confirmButtonWrapper}>
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
    margin: 15
  }
});
