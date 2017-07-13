import { View, FlatList, StyleSheet } from 'react-native';
import React, { Component } from 'react'
import Search from 'react-native-search-box';
import {themeColor} from '../res/values/styles'

const TAB_MESSENGER = 2
const TAB_FACEBOOK = 3
const TAB_TWITTER = 4

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
        return isChosen || (item[field] && item[field].toLowerCase().includes(this.state.currentText.toLowerCase()))
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
            onDelete={() => this._onChangeText("")}
            onCancel={() => this._onChangeText("")}
          />
          <FlatList
            removeClippedSubviews={false}
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
