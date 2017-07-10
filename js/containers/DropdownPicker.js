import React, {Component} from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import {View} from 'react-native';

export default class DropdownPicker extends Component {
  state = {
    dropdownWidth: 100,
  }

  _onLayout = (event) => {
    const {width} = event.nativeEvent.layout;
    if (width !== this.state.dropdownWidth) {
      this.setState({dropdownWidth: width});
    }
  }

  render() {
    return (
      <View
        onLayout={this._onLayout}
        style={this.props.style}>
        <ModalDropdown
          dropdownStyle={[this.props.dropdownStyle, {height: 300, width: this.state.dropdownWidth}]}
          options={this.props.options}
          renderRow={this.props.renderRow}
          onSelect={this.props.onSelect}>
          {this.props.children}
        </ModalDropdown>
      </View>
    );
  }
}
