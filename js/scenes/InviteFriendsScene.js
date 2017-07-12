import { LoginButton, AccessToken } from 'react-native-fbsdk'
import React, { Component } from 'react'
import { View, Image, Alert, Button, StyleSheet, Text, TouchableWithoutFeedback, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
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
import ShareAccess from '../utils/ShareModule';
import {IS_IOS} from '../settings.js';
import InAppNotification from '../components/InAppNotification';
import {connectToApp} from '../utils/ReduxConnect';

// ...

// Build up a shareable link.


// ...

// Share the link using the share dialog.

ELLIOT_LINK = "http://elliot.ai"

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

@connectToApp
export default class InviteFriendsScene extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor, focused}) =>
      focused ? <Image style={s.tabIcon} source={require('../res/images/invite_active.png')}/>
        : <Image style={s.tabIcon} source={require('../res/images/invite_grey.png')}/>,
  };

  state = {
    activeTab: 0,
    emails: [],
    numbers: [],
    isAlertOpen: false,
    alertContact: null
  }

  componentWillMount = () => {

  }

  _inviteFacebook = (dailog) => {
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: ELLIOT_LINK,
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

    if (IS_IOS) {
      ShareAccess.shareOnTwitter(ELLIOT_LINK, strings.inviteTwitter);
      return;
    }
    let shareOptions = {
      title: "Try out Elliot!",
      message: strings.inviteTwitter,
      url: ELLIOT_LINK
    };
    Share.shareSingle(Object.assign(shareOptions, {
          "social": "twitter"
        }));
  }

  _inviteMessenger = () => {

    if (IS_IOS) {
      ShareAccess.shareOnMessenger(ELLIOT_LINK, strings.inviteFacebook);
    } else {
      this._inviteFacebook(MessageDialog);
    }
  }

  _onTabPress = (i) => {
    if (i >= 0 && i <= 1) {
      this.setState({activeTab: i})
    } else {
      switch(i) {
        case TAB_MESSENGER:
          this.props.appActions.logShare("fb-messenger", ``)
          this._inviteMessenger()
          break;
        case TAB_FACEBOOK:
          this.props.appActions.logShare("fb-share", ``)
          this._inviteFacebook(ShareDialog)
          break;
        case TAB_TWITTER:
          this.props.appActions.logShare("twitter", ``)
          this._inviteTwitter()
          break;
      }
    }
  }

  _onContactPress = (contact) => {
    console.log(this.state.activeTab)
    this.props.appActions.logShare(this.state.activeTab? "email": "sms", `${contact.firstName} ${contact.lastName}`)

    if (this.state.activeTab) {
      console.log('email')
      if (IS_IOS) {
        ShareAccess.sendMail([contact.contact], "Try out Elliot!", format(strings.inviteDirected, contact.firstName)).then((res) => {
          console.log(res);
          this._showInAppNotif(contact);
        }).catch((err) => {
          console.log(err);
        });
      } else {
        email([contact.contact], null, null, "Try out Elliot!", format(strings.inviteDirected, contact.firstName))
      }
    } else {
      console.log('text')
      if (IS_IOS) {
        this._sendSMSIOS(contact);
      } else {
        this.setState({alertContact: contact, isConfirmationOpen: true})
      }
    }
  }

  _sendSMS = () => {
    PhoneAccess.sendSMS(this.state.alertContact.contact, strings.inviteDirectedSMS).then(() => {
      this.setState({isAlertOpen: true})
    })
  }

  _showInAppNotif = (contact) => {
    this.notification.show(
      `${contact.firstName} was successfuly invited.`,
      'Tell more friends about Elliot to stay in touch!'
    );
  }

  _sendSMSIOS = (contact) => {
    console.log(contact);
    const number = contact.contact;
    const content = strings.inviteDirectedSMS;
    console.log(number);
    ShareAccess.sendSMS([number], content).then((res) => {
      console.log(res);
      this._showInAppNotif(contact);
    }).catch((err) => {
      console.log(err);
    });
  }

  _renderItem = ({item, index}) => {
    return (<TouchableHighlight underlayColor={themeColorLight} onPress={() => this._onContactPress(item)}>
      <View style={[s.row, s.stretch, s.alignItemsCenter, index != 0? s.borderTopGrey: null]}>
        {item.hasThumbnail &&
          <Image style={styles.contactAvatar} source={{uri: item.thumbnailPath}}/>
        }
        {!item.hasThumbnail &&
          <Text style={[styles.contactAvatar, styles.contactInitials]}>{item.firstName && item.firstName[0].toUpperCase()}{item.lastName && item.lastName[0].toUpperCase()}</Text>
        }
        <Text style={[s.flex, styles.nameText]}>{item.firstName} {item.middleName? item.middleName + ' ': ''}{item.lastName}</Text>
        <Image
          style={[s.icon40, s.marginRight10]}
          source={this.state.activeTab? ICON_EMAIL: ICON_MESSAGE}/>
      </View>
    </TouchableHighlight>)
  }

  render() {
    const data = this.state.activeTab? this.props.app.emails: this.props.app.numbers
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
        <InAppNotification ref={(ref) => { this.notification = ref; }} />
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
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    margin: 10,
  },
  contactInitials: {
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#B4BBBE',
    padding: 5,
    fontSize: 19,
  },
  invitedModalButton: {
    width: 200
  },
  nameText: {
    fontSize: 17,
  }
});
