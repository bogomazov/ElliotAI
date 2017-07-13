import React, {Component} from 'react';
import ReactNative, { TextInput, FlatList } from 'react-native';
import { IS_ANDROID } from '../settings.js';

const EXTRA_SPACING = IS_ANDROID? -20: 0

export default class CustomListView extends Component {
  onInputFocus = (bottomSpacing) => {
    const scrollResponder = this.flatList._listRef._scrollRef.getScrollResponder();
    const focusedField = TextInput.State.currentlyFocusedField();
    const inputHandle = ReactNative.findNodeHandle(focusedField);
    // Delay scrolling until keyboard fully appears to make this work on device:
    // https://github.com/facebook/react-native/issues/3195#issuecomment-146563568
    const offset = (this.listMarginTop || 0) + bottomSpacing + EXTRA_SPACING
    setTimeout(() => {
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(inputHandle, offset, true);
    }, 500);
  }

  _onLayout = (event) => {
    const {layout} = event.nativeEvent
    this.listMarginTop = layout.y
  }

  render = () => <FlatList
    onLayout={this._onLayout}
    ref={(ref) => this.flatList = ref}
    keyboardShouldPersistTaps="handled"
    removeClippedSubviews={false}
    onRefresh={this.props.onRefresh}
    refreshing={this.props.refreshing}
    data={this.props.data}
    keyExtractor={this.props.keyExtractor}
    renderItem={({item}) => this.props.renderItem({item, onInputFocus: this.onInputFocus})} />
}
