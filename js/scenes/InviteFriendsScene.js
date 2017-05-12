import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
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

@connect(mapStateToProps, mapDispatchToProps)
export default class InviteFriendsScene extends Component {
	state = {
		activeTab: 0
	}
	_onTabPress = (i) => {

	}

  render() {
		const icons = [
			require('../res/images/call-66px.png'),
			require('../res/images/messageicon.png'),
			require('../res/images/message_black-66px.png'),
		]
    return (
      <View style={styles.container}>
        <TopBar>
          <Text
            style={styles.topBarText}>
            {strings.tellFriendsTop}
            </Text>
        </TopBar>
        <InviteTabs
					activeTab={this.state.activeTab}
					onTabPress={this._onTabPress}
					icons={icons}/>

        <Text>Invite Friends
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

  topBar: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderBottomColor: '#CBCBCF',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },

  topBarText: {
    color: themeColor,
    fontFamily: 'OpenSans-Bold'
  }

});
