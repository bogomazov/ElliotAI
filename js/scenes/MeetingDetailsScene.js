import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
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

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MeetingDetailsScene extends Component {
    state = {
      userSuggestions: [],
      isUserSuggestionsLoaded: false,
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
    if (!this.state.selectedMeeting}) {
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
                        onPress={this._onMeetingPress}/>}}
              /> 
        </View>
      );
    }
    return <MeetingDetailsScene meeting={this.state.selectedMeeting} onMeetingClose={this._onMeetingClose} />
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
