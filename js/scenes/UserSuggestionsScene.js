import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { NavigationActions } from 'react-navigation'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import {INVITE_FRIENDS_TAB} from './MainScene'
import TellFriendsCard from '../components/TellFriendsCard'
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

	_onSuggestionPress = (suggestion, times) => {
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
    this.props.appActions.acceptSuggestion(suggestion, times).then((data) => {
      this.setState({isAcceptLoading: false})
      this.props.appActions.removeSuggestion(suggestion)
      // Refresh confirmed-meetings
      this.props.appActions.calendarLoading();
      this.props.appActions.loadScheduledMeetings();
      this.props.appActions.rejectSuggestion(rootSuggestion, 'another-time').then(() => {
        this.props.appActions.loadSuggestions()
      })
      const ownSkipBack = this.props.navigation.state.params.skipBack;
      const skipBack = ownSkipBack ? ownSkipBack : this.props.navigation.state.key;
      // TODO: HOW DO YOU GO BACK TO THE MAIN PAGE
      setTimeout(() => {
        this.props.appActions.showAcceptedBanner(true);
      }, 300);
    }).catch((err) => {
      this.setState({isAcceptLoading: false})
    })
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
        <FlatList
          data={[...this.state.userSuggestions]}
          keyExtractor={this._keyExtractor}
          renderItem={({item}, i) => {
            return <SuggestionCard
                      key={i}
                      suggestion={item}
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
