import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React, { Component } from 'react'
import { IS_TEST_SUGGESTIONS } from '../settings';
import {connectToApp} from '../utils/ReduxConnect';
import { themeColor } from '../res/values/styles.js';
import CatchUpCard from '../components/CatchUpCard'
import CustomListView from '../containers/CustomListView'
import InAppNotification from '../components/InAppNotification';
import IntroLabel from '../components/IntroLabel'
import Suggestion from '../state/models/suggestion';
import SuggestionCard from '../components/SuggestionCard'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import s from '../res/values/styles'
import strings from '../res/values/strings'

const SHOW_CATCH_UP_CARD = 1 // if certain number of suggestions loaded

@connectToApp
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
      this.props.appActions.calendarLoading()
      this.props.appActions.loadScheduledMeetings()
      this.props.appActions.loadSuggestions()
      if (!suggestion.is_invite) {
          setTimeout(() => {
              this.props.appActions.showAcceptedBanner(true);
          }, 300);
      }
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
      'Sent your invite!',
      'You\'ll get a confirmation for a time that works.',
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
              if (this.props.app.friends.length >= SHOW_CATCH_UP_CARD) {
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
    meeting_times: ["2017-07-03 18:00:00"],
    meeting_type: "Call",
    is_invite: 1,
    events: [{
      begin: "2017-05-19 17:00:00",
      end: "2017-05-19 18:00:00",
      name: "Test event"
    }]
  },
]
}
