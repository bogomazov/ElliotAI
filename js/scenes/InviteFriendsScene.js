import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, Alert, Button, StyleSheet, Text, TouchableWithoutFeedback, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import CustomButton from '../components/CustomButton'
import CustomModal from '../components/CustomModal'
import AlertDialog from '../components/AlertDialog'
import InviteTabs from '../containers/InviteTabs'
import strings, {format} from '../res/values/strings'
import {themeColor, themeColorLight} from '../res/values/styles'
import Search from '../containers/Search'
import Contacts from 'react-native-contacts'

// import SendSMS from 'react-native-send-sms'
import {email, text, textWithoutEncoding} from 'react-native-communications'
import {ShareDialog, MessageDialog} from 'react-native-fbsdk'
import Share from 'react-native-share';
import PhoneAccess from '../utils/PhoneNumberModule';

// ...

// Build up a shareable link.


// ...

// Share the link using the share dialog.

const mapStateToProps = (state) => {
	return {app: state.app}
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
		numbers: [],
		isAlertOpen: false,
		alertContact: null
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
		console.log(this.props)
		if (this.props.app.isContactsLoaded) {
			return
		}
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
				this.props.appActions.newContacts(numbers, emails)
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
			this.setState({alertContact: contact, isConfirmationOpen: true})
		}
	}

	_sendSMS = () => {
		PhoneAccess.sendSMS(this.state.alertContact.contact, strings.inviteDirectedSMS).then(() => {
			this.setState({isAlertOpen: true})
		})
	}


	_renderItem = ({item, index}) => {
		return (<TouchableHighlight underlayColor={themeColorLight} onPress={() => this._onContactPress(item)}>
			<View style={[s.row, s.stretch, s.alignItemsCenter, index != 0? s.borderTopGrey: null]}>
				<Text style={styles.contactAvatar}>{item.firstName && item.firstName[0].toUpperCase()}{item.lastName && item.lastName[0].toUpperCase()}</Text>
				<Text style={s.flex}>{item.firstName} {item.middleName? item.middleName + ' ': ''}{item.lastName}</Text>
				<Image
					style={[s.icon40, s.marginRight10]}
					source={this.state.activeTab? ICON_EMAIL: ICON_MESSAGE}/>
			</View>
		</TouchableHighlight>)
	}

  render() {
		const data = this.state.activeTab? this.props.app.emails: this.props.app.numbers
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
				<AlertDialog isOpen={this.state.isConfirmationOpen}
										 onClosed={() => this.setState({isConfirmationOpen: false})}
									 		title="Are you sure?"
											description={`You are about to send a SMS invitation to ${this.state.isConfirmationOpen && this.state.alertContact.firstName}`}
											onSuccessTitle='Invite'
											onCancelTitle='Cancel'
											onSuccess={() => {
												this.setState({isConfirmationOpen: false})
												this._sendSMS()
											}}/>
				<AlertDialog isOpen={this.state.isAlertOpen}
										 onClosed={() => this.setState({isAlertOpen: false})}
									 		title={`${this.state.isAlertOpen && this.state.alertContact.firstName} was successfuly invited.`}
											description='Tell more friends about Elliot to stay in touch!'
											onCancelTitle='Ok'/>
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
	},
	invitedModalButton: {
		width: 200
	}
});
