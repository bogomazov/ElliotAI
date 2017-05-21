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
import {themeColor, themeColorLight} from '../res/values/styles'
import Search from '../containers/Search'
import Contacts from 'react-native-contacts'
// import SendSMS from 'react-native-send-sms'
import {email, text} from 'react-native-communications'
import {ShareDialog, MessageDialog} from 'react-native-fbsdk'
import NavigationTopBar from '../components/NavigationTopBar';
import User from '../state/models/user';
import Arrow from '../components/Arrow';

const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FriendsScene extends Component {
  state = {
    friends: []
  }
	componentWillMount = () => {
		// loadFriends
    this.props.appActions.loadFriends().then((data) => {
      console.log(data)
			this.setState({friends: data.map((item) => new User(item))})
    })
	}

	_onFriendPress = (friend) => {
		this.props.navigation.navigate('UserSuggestionsScene', {user: friend})
	}

	_renderItem = ({item, index}) => {
		console.log(item)
		const friend = item
		return (<TouchableHighlight underlayColor={themeColorLight} onPress={() => this._onFriendPress(friend)}>
			<View style={[...[s.row, s.stretch, s.alignItemsCenter, s.padding10], index? s.borderTopGrey: null]}>
				<Image
					style={s.avatar30}
					source={{ uri: friend.image}}/>
				<Text style={[s.marginLeft10]}>{friend.first_name} {friend.last_name}</Text>
				<Arrow styleIcon={{height: 30, width: 30}} />
			</View>
		</TouchableHighlight>)
	}

  render() {
		console.log(this.state)
    return (
      <View style={styles.container}>
        <NavigationTopBar navigation={this.props.navigation} title={'I want to catch up with'} />
				<Search
          data={this.state.friends}
					keyExtractorByField={'fb_id'}
					filterByFields={['first_name', 'last_name']}
					renderItem={this._renderItem}
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
		backgroundColor: 'white'
  },
});
