import { LoginButton, AccessToken } from 'react-native-fbsdk'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { View, Image, FlatList, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import * as appActions from '../state/actions/app';
import {SOCIAL_MEDIA_FB} from '../state/actions/app';
import {saveState} from '../index'
import TellFriendsCard from '../components/TellFriendsCard'
import TopBar from '../components/TopBar'
import InviteTabs from '../containers/InviteTabs'
import strings from '../res/values/strings'
import {themeColor} from '../res/values/styles'
import Search from 'react-native-search-box';
import PropTypes from 'prop-types';

const mapStateToProps = (state) => {
	return {state}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}

const TAB_MESSENGER = 2
const TAB_FACEBOOK = 3
const TAB_TWITTER = 4




@connect(mapStateToProps, mapDispatchToProps)
export default class SearchContainer extends Component {
  propTypes: {
    renderItem: any,
    filterByFields: string,
    keyExtractorByField: string,
    data: any
  }

  constructor(props) {
    super()
    console.log(props)
    this.state = {
      currentText: ''
    };
  }



  _keyExtractor = (item, index) => item[this.props.keyExtractorByField];


	_onChangeText = (text) => {
        return new Promise((resolve, reject) => {
            console.log('_onChangeText', text);
            this.setState({currentText: text})
            resolve();
        });
    }

   _getFilteredData = () => this.props.data.filter((item) => {
    // console.log(item)

     return this.props.filterByFields.reduce((isChosen, field) => {
        // console.log(field)
        return isChosen || (item[field] && item[field].toLowerCase().startsWith(this.state.currentText))
      }, false)})

  render() {
    // console.log(this.state.dataToShow)

    return (
      <View style={styles.container}>
					<Search
	          ref="search_bar"
						backgroundColor="#fff"
						titleCancelColor={themeColor}
						onChangeText={this._onChangeText}
	        />
          <FlatList
            data={this._getFilteredData()}
            keyExtractor={this._keyExtractor}
            renderItem={this.props.renderItem}/>
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
    fontFamily: 'OpenSans-Bold'
  }

});
