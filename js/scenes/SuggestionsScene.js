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

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SuggestionsScene extends Component {
  
	_onSuggestionPress = (suggestion) => {
      this.props.navigation.navigate('ScheduleScene', {suggestion})
	}

	_onMoreOptionsPress = (suggestion) => {
      
	}

	_onShowLessPress = (suggestion) => {
      this.props.appActions.rejectSuggestion(suggestion, 'neither')
	}

	componentWillMount = () => {
		console.log(this.props)
		if (!this.props.app.isSuggestionsLoaded) {
			this.props.appActions.loadSuggestions()
		}
	}
    
    _keyExtractor = (item, index) => item.id;

  render() {
		console.log(this.props)

    return (
      <View style={styles.container}>
        <TopBar isMainScene>
          <Image
            style={styles.topBarIcon}
            source={require('../res/images/Icon-50.png')}/>
        </TopBar>
        <FlatList
          data={[...this.props.app.suggestions, {isTellFriends: true}]}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) => {
            if (item.isTellFriends) {
              return <TellFriendsCard onPress={() => this.props.switchTab(INVITE_FRIENDS_TAB)} />
            }
            return <SuggestionCard
                      suggestion={item} 
                      onPress={this._onSuggestionPress} 
                      onMoreOptionsPress={this._onMoreOptionsPress} 
                      onShowLessPress={this._onShowLessPress} withOptions/>}}
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
    alignItems: 'center',
  },
  topBarIcon: {
    height: 40,
    width: 40
  }
});
