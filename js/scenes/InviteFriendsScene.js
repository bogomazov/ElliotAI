import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Button, StyleSheet, Text, TouchableWithoutFeedback, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import InviteTabs from '../containers/InviteTabs'
import strings, {format} from '../res/values/strings'
import {themeColor} from '../res/values/styles'
import Search from '../containers/Search'
import Contacts from 'react-native-contacts'
// import SendSMS from 'react-native-send-sms'
import {email, text} from 'react-native-communications'
import {ShareDialog, MessageDialog} from 'react-native-fbsdk'
import Share from 'react-native-share';

// ...

// Build up a shareable link.


// ...

// Share the link using the share dialog.

const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

TYPE_SMS = "sms"
TYPE_EMAIL = "email"
TYPE_MESSENGER = "fb-messenger"
TYPE_MESSENGER = "fb-share"
TYPE_MESSENGER = "twitter"

const TAB_MESSENGER = 2
const TAB_FACEBOOK = 3
const TAB_TWITTER = 4

const ICON_MESSAGE = require('../res/images/messageicon.png')
const ICON_EMAIL = require('../res/images/message_black-66px.png')

const icons = [
	ICON_MESSAGE,
	ICON_EMAIL,
	require('../res/images/download.png'),
	require('../res/images/fb-icon-66px.png'),
	require('../res/images/Twitter_Logo_Blue.png'),
]

@connect(mapStateToProps, mapDispatchToProps)
export default class InviteFriendsScene extends Component {
	state = {
		activeTab: 0,
		emails: [],
		numbers: []
	}

	_reduceContacts = (contacts, field, secondField) => contacts.reduce((newArray, item, i) => {
		if (item[field].length > 0) {
					newArray.push({
						id: i,
						firstName: item.givenName,
						middleName: item.middleName,
						lastName: item.familyName,
						contact: item[field][0][secondField]})
			}
			return newArray
	}, []);

	componentWillMount = () => {
		Contacts.getAll((err, contacts) => {
			console.log(err)
			if(err === 'denied'){
				// x.x
				console.log('Contacts denied')

				this.props.appActions.switchPermissionsOff()
			} else {
				console.log('Contacts')
				console.log(contacts)

				emails = this._reduceContacts(contacts, 'emailAddresses', 'email')
				numbers = this._reduceContacts(contacts, 'phoneNumbers', 'number')
				console.log(emails)
				this.setState({emails, numbers})
			}
		})
	}

	_inviteFacebook = (dailog) => {
		const shareLinkContent = {
		  contentType: 'link',
		  contentUrl: "http://elliot.ai",
		  contentDescription: strings.inviteFacebook,
		};
	  var tmp = this;
	  dailog.canShow(shareLinkContent).then((canShow) => {
			console.log(canShow)
	      if (canShow) {
	        return dailog.show(shareLinkContent);
	      }
	    }
	  ).then((result) => {
	      if (result.isCancelled) {
	        consle.log('Share cancelled');
	      } else {
					// this.appActions.
	        console.log('Share success with postId: '
	          + result);

	      }
	    },
	    (error) => {
	      console.log('Share fail with error: ' + error);
	    }
	  );
	}

	_inviteTwitter = () => {
		let shareOptions = {
			title: "React Native",
			message: strings.inviteTwitter,
			url: "http://elliot.ai"
		};
		Share.shareSingle(Object.assign(shareOptions, {
					"social": "twitter"
				}));
	}

	_onTabPress = (i) => {
		if (i >= 0 && i <= 1) {
			this.setState({activeTab: i})
		} else {
			switch(i) {
				case TAB_MESSENGER:
					this._inviteFacebook(MessageDialog)
					break;
				case TAB_FACEBOOK:
					this._inviteFacebook(ShareDialog)
				case TAB_TWITTER:
					this._inviteTwitter()
        break;
			}
		}
	}

	_onContactPress = (contact) => {
		console.log(this.state.activeTab)
		if (this.state.activeTab) {
			console.log('email')
			email([contact.contact], null, null, "Try out Elliot!", format(strings.inviteDirected, contact.firstName))
		} else {
			console.log('text')
			text(contact.contact, format(strings.inviteDirected, contact.firstName))

		}
	}

	_renderItem = ({item}) => {
		return (<TouchableWithoutFeedback onPress={() => this._onContactPress(item)}>
			<View style={[s.row, s.stretch, s.alignItemsCenter]}>
				<Text style={styles.contactAvatar}>{item.firstName && item.firstName[0].toUpperCase()}{item.lastName && item.lastName[0].toUpperCase()}</Text>
				<Text style={s.flex}>{item.firstName} {item.middleName} {item.lastName}</Text>
				<Image
					style={[s.icon40, s.marginRight10]}
					source={this.state.activeTab? ICON_EMAIL: ICON_MESSAGE}/>
			</View>
		</TouchableWithoutFeedback>)
	}

  render() {
		const data = this.state.activeTab? this.state.emails: this.state.numbers
		console.log(data)
    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          <Text
            style={styles.topBarText}>
            {strings.tellFriendsTop}
            </Text>
        </TopBar>
        <InviteTabs
					activeTab={this.state.activeTab}
					onTabPress={this._onTabPress}
					icons={icons}/>
				<Search
          data={data}
					keyExtractorByField={'id'}
					filterByFields={['firstName', 'middleName', 'lastName']}
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

  topBarText: {
    color: themeColor,
    fontFamily: 'OpenSans-Bold'
  },
	contactAvatar: {
		width: 30,
		height: 30,
		margin: 10,
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: 100,
		color: 'white',
		backgroundColor: '#B4BBBE',
		padding: 5
	}

});
