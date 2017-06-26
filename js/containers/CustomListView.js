import {IS_IOS} from '../settings.js';
import s, {themeColorThird} from '../res/values/styles.js';
import React, {Component} from 'react';
import ReactNative, { TextInput, View, FlatList, Image, Button, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, NativeModules, NativeEventEmitter, ActivityIndicator} from 'react-native'
import Notification from 'react-native-in-app-notification'



export default class CustomListView extends Component {
  onInputFocus = () => {
    if (IS_IOS) {
      const scrollResponder = this.flatList._listRef._scrollRef.getScrollResponder();
      const focusedField = TextInput.State.currentlyFocusedField();
      const inputHandle = ReactNative.findNodeHandle(focusedField);
      const OFFSET = 145;
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(inputHandle, OFFSET, true);
    }
  }

  render = () => <FlatList
    ref={(ref) => this.flatList = ref}
    removeClippedSubviews={false}
    onRefresh={this.props.onRefresh}
    refreshing={this.props.refreshing}
    data={this.props.data}
    keyExtractor={this.props.keyExtractor}
    renderItem={({item}) => this.props.renderItem({item, onInputFocus: this.onInputFocus})} />
}
