import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import ReactNative, { Linking, TextInput, View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, NativeModules, NativeEventEmitter, ActivityIndicator} from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import Suggestion from '../state/models/suggestion';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import SuggestionCard from '../components/SuggestionCard'
import IntroLabel from '../components/IntroLabel'
import CatchUpCard from '../components/CatchUpCard'
import CustomListView from '../containers/CustomListView'
import strings from '../res/values/strings'
import s from '../res/values/styles'
import {IS_DEV, IS_ANDROID, IS_IOS, IS_TEST_SUGGESTIONS} from '../settings'
import moment from 'moment'
import {themeColor, themeColorThird} from '../res/values/styles.js'
import Notification from 'react-native-in-app-notification'
import InAppNotification from '../components/InAppNotification';
import DeepLinking from 'react-native-deep-linking'

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}


const SHOW_CATCH_UP_CARD = 1 // if certain number of suggestions loaded

// open-tab notif constants
const weekly = 0
const friendJoined = 1
const confirmed = 2
const reschedule = 3
const update = 4
const openInvite = 5

@connect(mapStateToProps, mapDispatchToProps)
export default class SuggestionsScene extends Component {
  static navigationOptions = {
    tabBarIcon: ({tintColor, focused}) =>
      focused ? <Image style={s.tabIcon} source={require('../res/images/home_active_1.5-66px.png')}/>
        : <Image style={s.tabIcon} source={require('../res/images/home_gray-66px.png')}/>,
  };

	state = {
	  isAcceptLoading: false,
		isLocationSent: false,
		isEventsSent: false,
		rejectingIds: [],
	}

	_onSuggestionPress = (suggestion, times, message) => {
    console.log(this.props);
    console.log(suggestion);
    console.log(times);
    if (times.length == 0) {
      return
    }
    if (IS_TEST_SUGGESTIONS) {
      this.props.appActions.showAcceptedBanner(true);
      return
    }
    if (this.state.isAcceptLoading) {
      return
    }

    this.setState({isAcceptLoading: true})
    this.props.appActions.acceptSuggestion(suggestion, times, message).then((data) => {
      this.setState({isAcceptLoading: false})
      this.props.appActions.removeSuggestion(suggestion)
      // Refresh confirmed-meetings
      this.props.appActions.calendarLoading();
      this.props.appActions.loadScheduledMeetings();
      this.props.appActions.loadSuggestions()
      setTimeout(() => {
        this.props.appActions.showAcceptedBanner(true);
      }, 300);
    }).catch((err) => {
      this.setState({isAcceptLoading: false})
    })
	}

	_onMoreOptionsPress = (suggestion) => {
    this.props.screenProps.mainNav.navigate('UserSuggestionsScene', {
			user: suggestion.friend,
			rootSuggestion: suggestion,
		})
	}

	_onCatchUpPress = () => {
		console.log('_onCatchUpPress')
		this.props.screenProps.mainNav.navigate('FriendsScene')
	}

	_onShowLessPress = (suggestion) => {
		this.setState({rejectingIds: [...this.state.rejectingIds, suggestion.id]});
		this.props.appActions.rejectSuggestion(suggestion, 'neither').then((data) => {
			this.setState({rejectingIds: this.state.rejectingIds.filter((id) => id !== suggestion.id)});
			this.props.appActions.loadSuggestions();
		})
	}

	componentWillMount = () => {
		console.log(this.props)
    console.log(this.props.appActions.newSuggestions);
	}

  componentDidMount() {
    this._handleOpenTabNotifs();
  }

  _handleOpenTabNotifs = () => {
    DeepLinking.addRoute('/open-tab/:code', (response) => {
      console.log(response)
      switch (parseInt(response.code)) {
        case weekly:
        case friendJoined:
        case reschedule:
        case update:
          this.props.navigation.navigate('SuggestionsTab');
	        break;
        case openInvite:
          this.props.navigation.navigate('InviteFriendsTab');
					break;
        case confirmed:
          this.props.navigation.navigate('CalendarTab');
					break;
      }
    });
  }

  componentDidUpdate() {
    this._showBannerIfNeeded();
  }

  _keyExtractor = (item, index) => item.id;

	_refresh = () => {
		if (IS_TEST_SUGGESTIONS) {
			suggestions = TEST_SUGGESTIONS.data.map((item) => {return new Suggestion(item)})
			this.props.appActions.newSuggestions(suggestions)
			return
		}
		this.props.appActions.loadSuggestions()
	}

  _showBannerIfNeeded = () => {
    if (!this.props.app.shouldShowAcceptedBanner) {
      return;
    }
    this.props.appActions.showAcceptedBanner(false);
		console.log(this.notification)
		this.notification.show(
			'Great! You accepted a suggestion',
			'Meeting will be scheduled once Elliot finds a time that works for both of you',
			() => console.log('notification clicked'),
		)
	}

  render() {

		console.log(this.props)
    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          <Image
            style={styles.topBarIcon}
            source={require('../res/images/Icon-50.png')}/>
        </TopBar>
        {!this.props.app.isIntroSuggestionsSeen && <IntroLabel
                                                    text={strings.introSuggestions}
                                                    onClosePress={() => this.props.appActions.introSuggestionsSeen()}/>}
				{!this.props.app.isSuggestionsLoaded &&
					<ActivityIndicator animating={true} color={themeColor} size="large" style={styles.activityIndicator}/>
				}
				{this.props.app.isSuggestionsLoaded &&
				<CustomListView
					onRefresh={this._refresh}
					refreshing={this.props.app.isSuggestionsLoading}
          data={[{isCatchUp: true, id: -2}, ...this.props.app.suggestions, {isTellFriends: true, id: -1}]}
          keyExtractor={this._keyExtractor}
          renderItem={({item, onInputFocus}) => {
						if (item.isCatchUp) {
							if (this.props.app.suggestions.length >= SHOW_CATCH_UP_CARD) {
								return <CatchUpCard onPress={this._onCatchUpPress} />
							}
							return
						}

            if (item.isTellFriends) {
              return <TellFriendsCard isMoreFriends={this.props.app.suggestions.length !== 0} onPress={() => {
								this.props.navigation.navigate('InviteFriendsTab');
							}} />
            }
            return <SuggestionCard
                      suggestion={item}
                      onConfirmPress={this._onSuggestionPress}
                      onMoreOptionsPress={this._onMoreOptionsPress}
                      onShowLessPress={this._onShowLessPress}
                      onInputFocus={onInputFocus}
											animateShowLess={this.state.rejectingIds.indexOf(item.id) !== -1} withOptions/>
						}}
            />}

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
    alignItems: 'stretch',
  },
  topBarIcon: {
    height: 40,
    width: 40
  },
	activityIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
});
// id: undefined,
// meeting_time: undefined,
// friend: undefined,
// meeting_type: undefined
const TEST_SUGGESTIONS  = { data: [
  {
		id:15295,
    friend: {
      fb_id: "211646206019277",
      first_name: "Danil5",
      image: "https://scontent.xx.fbcdn.net/v/t1.0-1/c15.0.50.50/p50x50/10354686_10150004552801856_220367501106153455_n.jpg?oh=99f7a23b27b7b285107a17ae7a3003da&oe=59AF882F",
      last_name: "andrey"
    },
    meeting_time: "2017-05-19 17:00:00",
    meeting_type: "Call",
  },
]
}
