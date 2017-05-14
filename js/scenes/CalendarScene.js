import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Button, TouchableWithoutFeedback, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import InviteTabs from '../containers/InviteTabs'
import strings from '../res/values/strings'
import {themeColor} from '../res/values/styles'


const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

const UPCOMING = 0
const PAST = 1

@connect(mapStateToProps, mapDispatchToProps)
export default class CalendarScene extends Component {
	state = {
		activeTab: 0
	}
	_onTabPress = (i) => {

	}

  render() {
    
    tabs = ["Upcoming", "Past"]
    
    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          {tabs.map((title, i) => {
            
            let style = [styles.tab]
            
            if (i == this.state.activeTab) {
              style.push(styles.selectedTab)
            }
            console.log(style)
            return <TouchableWithoutFeedback>
              <Text
                  style={style}>
                  {title}
                </Text>
              </TouchableWithoutFeedback>            
          })}
        </TopBar>
       
        <Text>calendar
        </Text>
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
    // backgroundColor: 'grey',
  },
  
  tab: {
    fontFamily: 'OpenSans-Bold',
//     margin: 5
  },
  
  selectedTab: {
      color: themeColor,
  },

});
