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
import CatchUpCard from '../components/CatchUpCard'
import strings from '../res/values/strings'

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
		isRefreshing: false
	}

	_onSuggestionPress = (suggestion) => {
      this.props.navigation.navigate('ScheduleScene', {suggestion})
	}

	_onMoreOptionsPress = (suggestion) => {
      this.props.navigation.navigate('UserSuggestionsScene', {user: suggestion.friend})
	}

	_onCatchUpPress = () => {
		console.log('_onCatchUpPress')
		this.props.navigation.navigate('FriendsScene')
	}

	_onShowLessPress = (suggestion) => {
      this.props.appActions.rejectSuggestion(suggestion, 'neither')
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({isRefreshing: false})
	}

	componentWillMount = () => {
		console.log(this.props)
	}

  _keyExtractor = (item, index) => item.id;

	_refresh = () => {
		this.setState({isRefreshing: true})
		this.props.appActions.loadSuggestions()
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
