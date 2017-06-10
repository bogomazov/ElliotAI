import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, AppState, NativeModules, NativeEventEmitter, ActivityIndicator} from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import SuggestionCard from '../components/SuggestionCard'
import IntroLabel from '../components/IntroLabel'
import CatchUpCard from '../components/CatchUpCard'
import strings from '../res/values/strings'
import LocationAccess from '../utils/LocationAccessModule'
import {IS_DEV, IS_ANDROID, IS_IOS} from '../settings'
import {getEvents} from '../utils/Calendar'
import moment from 'moment'
import {themeColor} from '../res/values/styles.js'
import Notification from 'react-native-in-app-notification'


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
		appState: AppState.currentState,
		nativeEventsSubscription: null,
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

		if (!this.props.app.isSuggestionsLoaded) {
			this._updateData()
		}
	}

	componentDidMount = () => {
		AppState.addEventListener('change', this._onAppStateChange)
		if (IS_IOS) {
			const NSNotificationEvent = new NativeEventEmitter(NativeModules.NSNotificationAccess);
			this.state.nativeEventsSubscription = NSNotificationEvent.addListener(
				'refreshSuggestions',
				(data) => {
					this.props.appActions.loadSuggestions();
				}
			);
		}
	}

	componentWillUnmount = () => {
		AppState.removeEventListener('change', this._onAppStateChange)
		if (IS_IOS) {
			if (this.state.nativeEventsSubscription) {
				this.state.nativeEventsSubscription.remove();
			}
		}
	}

	_onAppStateChange = (nextAppState) => {
		const wasOnBackground = (this.state.appState === 'inactive' || this.state.appState === 'background');
		if (wasOnBackground && nextAppState === 'active') {
			this._updateData();
		}
		this.setState({appState: nextAppState});
	}

  _keyExtractor = (item, index) => item.id;

	_refresh = () => {
		this.setState({isRefreshing: true})
		this.props.appActions.loadSuggestions()
	}

	_updateData = () => {
		LocationAccess.checkLocationAccess().then((response) => {
      console.log(response)
      if (response == 'success') {
				LocationAccess.requestLocation().then((location) => {
					console.log(location)
					this.props.appActions.sendLocation(location.lng, location.lat, location.timestamp).then(data => {
			       this.props.appActions.newLocation(location.lng, location.lat, location.timestamp)
						 this._updateCalendarEvents()
					})
        // this._requestCurrentLocation()
				})
    	}
		}).catch((error) => {
      console.log(error)
			// On iOS location permission is optional.
			// So if access hasn't been granted, move on with calendar events.
			if (IS_IOS) {
				this._updateCalendarEvents()
			}
    })
  }

	_updateCalendarEvents = () => {
		console.log('getting events')
		getEvents(moment(), moment().add(1, 'months')).then(events => {
					// handle events
					console.log('Calendar fetchAllEvents')
					console.log(events)
					if (events.length > 0) {
						this.props.appActions.sendEvents(events).then(data=> {
							this.props.appActions.loadSuggestions()
						})
					}
				})
				.catch(error => {
					console.log(error)
					this.props.appActions.switchPermissionsOff()
				 // handle error
				});
	}

	_onScheduleMeeting = () => {
		this.notification.show(
      'Great! You accepted a suggestion',
      'Meeting will be scheduled once Elliot finds a time that works for both of you',
      () => console.log('notification clicked'),
    )
	}

	_notificationComponent = ({title, message}) => {
		return <View style={[s.padding10, {backgroundColor: 'green', height: 80}]}>
			<Text style={[s.textColorWhite, s.bold]}>{title}</Text>
			<Text style={[s.textColorWhite]}>{message}</Text>
		</View>
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
								if (IS_IOS) {
									NativeModules.NSNotificationAccess.post("showInviteNotif", null);
								} else {
									this.props.switchTab(INVITE_FRIENDS_TAB)
								}
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

						<Notification ref={(ref) => { this.notification = ref; }}
													notificationBodyComponent={this._notificationComponent}
													height={80} />
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
