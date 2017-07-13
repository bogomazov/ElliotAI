import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import React, { Component } from 'react'
import {connectToApp} from '../utils/ReduxConnect';
import { themeColorLight } from '../res/values/styles';
import Arrow from '../components/Arrow';
import NavigationTopBar from '../components/NavigationTopBar';
import RemoteImage from '../components/RemoteImage';
import Search from '../containers/Search'

@connectToApp
export default class FriendsScene extends Component {

  _onFriendPress = (friend) => {
    this.props.navigation.navigate('UserSuggestionsScene', {
      user: friend,
      skipBack: this.props.navigation.state.key
    })
  }

  _renderItem = ({item, index}) => {
    console.log(item)
    const friend = item
    return (<TouchableHighlight underlayColor={themeColorLight} onPress={() => this._onFriendPress(friend)}>
      <View style={[...[s.row, s.stretch, s.alignItemsCenter, s.padding10], index? s.borderTopGrey: null]}>
        <RemoteImage
          style={s.avatar30}
          source={{ uri: friend.image}}/>
        <Text style={[s.marginLeft10, {fontSize: 17}]}>{friend.first_name} {friend.last_name}</Text>
        <Arrow styleIcon={{height: 15, width: 15, marginRight: 5}} />
      </View>
    </TouchableHighlight>)
  }

  render() {
    console.log(this.props)
    return (
      <View style={styles.container}>
        <NavigationTopBar navigation={this.props.navigation} title={'Who do you want to see?'} />
        <Search
          data={this.props.app.friends}
          keyExtractorByField={'fb_id'}
          filterByFields={['first_name', 'last_name']}
          renderItem={this._renderItem}
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
    backgroundColor: 'white'
  },
});
