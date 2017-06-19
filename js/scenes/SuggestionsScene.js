import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, NativeModules, NativeEventEmitter, ActivityIndicator} from 'react-native'
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
import strings from '../res/values/strings'
import {IS_DEV, IS_ANDROID, IS_IOS, IS_TEST_SUGGESTIONS} from '../settings'
import moment from 'moment'
import {themeColor, themeColorThird} from '../res/values/styles.js'
import Notification from 'react-native-in-app-notification'
import InAppNotification from '../components/InAppNotification';

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}


const SHOW_CATCH_UP_CARD = 6 // if certain number of suggestions loaded



@connect(mapStateToProps, mapDispatchToProps)
export default class SuggestionsScene extends Component {

	state = {
		isRefreshing: false,
		isLocationSent: false,
		isEventsSent: false,
		rejectingIds: [],
	}

	_onSuggestionPress = (suggestion) => {
      this.props.navigation.navigate('ScheduleScene', {suggestion, onScheduleMeeting: this._onScheduleMeeting})
	}

	_onMoreOptionsPress = (suggestion) => {
      this.props.navigation.navigate('UserSuggestionsScene', {
				user: suggestion.friend,
				rootSuggestion: suggestion,
				onScheduleMeeting: this._onScheduleMeeting
			})
	}

	_onCatchUpPress = () => {
		console.log('_onCatchUpPress')
		this.props.navigation.navigate('FriendsScene')
	}

	_onShowLessPress = (suggestion) => {
		this.setState({rejectingIds: [...this.state.rejectingIds, suggestion.id]});
		this.props.appActions.rejectSuggestion(suggestion, 'neither').then((data) => {
			this.setState({rejectingIds: this.state.rejectingIds.filter((id) => id !== suggestion.id)});
			this.props.appActions.loadSuggestions();
		})
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({isRefreshing: false})
	}

	componentWillMount = () => {
		console.log(this.props)
    console.log(this.props.appActions.newSuggestions);
	}

  _keyExtractor = (item, index) => item.id;

	_refresh = () => {
		if (IS_TEST_SUGGESTIONS) {
			suggestions = TEST_SUGGESTIONS.data.map((item) => {return new Suggestion(item)})
			this.props.appActions.newSuggestions(suggestions)
			return
		}
		this.setState({isRefreshing: true})
		this.props.appActions.loadSuggestions()
	}

	_onScheduleMeeting = () => {
		console.log('_onScheduleMeeting')
		console.log(this.notification)
		// this.toShowNotification = true

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
				<FlatList
					onRefresh={this._refresh}
					refreshing={this.state.isRefreshing}
          data={[{isCatchUp: true, id: -2}, ...this.props.app.suggestions, {isTellFriends: true, id: -1}]}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) => {
						if (item.isCatchUp) {
							if (this.props.app.suggestions.length >= SHOW_CATCH_UP_CARD) {
								return <CatchUpCard onPress={this._onCatchUpPress} />
							}
							return
						}

            if (item.isTellFriends) {
              return <TellFriendsCard isMoreFriends={this.props.app.suggestions.length !== 0} onPress={() => {
								this.props.switchTab(INVITE_FRIENDS_TAB)
							}} />
            }
            return <SuggestionCard
                      suggestion={item}
                      onPress={this._onSuggestionPress}
                      onMoreOptionsPress={this._onMoreOptionsPress}
                      onShowLessPress={this._onShowLessPress}
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
