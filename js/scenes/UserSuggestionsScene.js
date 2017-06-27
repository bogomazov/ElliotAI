import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import ReactNative, { TextInput, View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { NavigationActions } from 'react-navigation'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
import CustomListView from '../containers/CustomListView'
import TopBar from '../components/TopBar'
import SuggestionCard from '../components/SuggestionCard'
import IntroLabel from '../components/IntroLabel'
import strings from '../res/values/strings'
import NavigationTopBar from '../components/NavigationTopBar';
import Suggestion from '../state/models/suggestion';
import {IS_DEV, IS_ANDROID, IS_IOS, IS_TEST_SUGGESTIONS} from '../settings'

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class UserSuggestionsScene extends Component {
    state = {
      isAcceptLoading: false,
      userSuggestions: [],
      isUserSuggestionsLoaded: false
    }

  // TODO: Refactor this part to prevent code duplication.
	_onSuggestionPress = (suggestion, times, message) => {
    console.log(this.props);
    console.log(suggestion);
    console.log(times);
    if (times.length == 0) {
      return
    }
    if (IS_TEST_SUGGESTIONS) {
      this.props.appActions.showAcceptedBanner(true);
      this._navigateHome();
      return
    }
    if (this.state.isAcceptLoading) {
      return
    }
    const rootSuggestion = this.props.navigation.state.params.rootSuggestion;
    this.setState({isAcceptLoading: true})
    this.props.appActions.acceptSuggestion(suggestion, times, message).then((data) => {
      this.setState({isAcceptLoading: false})
      this.props.appActions.removeSuggestion(suggestion)
      // Refresh confirmed-meetings
      this.props.appActions.calendarLoading();
      this.props.appActions.loadScheduledMeetings();
      if (rootSuggestion) {
        this.props.appActions.rejectSuggestion(rootSuggestion, 'another-time').then(() => {
          this.props.appActions.loadSuggestions()
        })
      }
      this._navigateHome();
      setTimeout(() => {
        this.props.appActions.showAcceptedBanner(true);
      }, 300);
    }).catch((err) => {
      this.setState({isAcceptLoading: false})
    })
	}

  _navigateHome = () => {
    console.log(this.props);
    const skipBack = this.props.navigation.state.params.skipBack;
    this.props.navigation.dispatch(NavigationActions.back({
      key: skipBack
    }))
  }

	componentWillMount = () => {
        this.props = {...this.props, ...this.props.navigation.state.params}
        this.props.appActions.loadUserSuggestions(this.props.user.fb_id).then((data) => {
        data = data.map((item) => {return new Suggestion(item)})
          this.setState({userSuggestions: data, isUserSuggestionsLoaded: true})
        }).catch((err) => console.log(err))
	}

    _keyExtractor = (item, index) => item.id;

  render() {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <NavigationTopBar navigation={this.props.navigation} />
        <CustomListView
          data={[...this.state.userSuggestions]}
          keyExtractor={this._keyExtractor}
          renderItem={({item, onInputFocus}) => {
            return <SuggestionCard
                      suggestion={item}
                      onInputFocus={onInputFocus}
                      onConfirmPress={this._onSuggestionPress}/>}}
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
//     alignItems: 'stretched',
  },
  topBarIcon: {
    height: 40,
    width: 40
  }
});
