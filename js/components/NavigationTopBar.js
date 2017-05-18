import { StyleSheet,TouchableWithoutFeedback, Button, Text, View, Image, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import TopBar from '../components/TopBar'
import s from '../res/values/styles'

export default NavigationTopBar = ({navigation, title}) => {
    _onBackPress = () => {
      navigation.goBack()
    }

      return (
        <TopBar isNavBar><View style={[s.row, styles.row]}>
          <TouchableWithoutFeedback onPress={this._onBackPress}>
              <Image
              style={styles.topBarIcon}
              source={require('../res/images/back.png')}/>
          </TouchableWithoutFeedback>
            <Text style={[s.alignItemsCenter, s.bold, s.textColorTheme]}>{title}</Text>
          </View>
        </TopBar>
      );
}

const styles = StyleSheet.create({
  topBarIcon: {
    height: 35,
    width: 35,
    left: 5,
    top: 5,
    position: 'absolute',
  },
  row: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
