import { StyleSheet,TouchableWithoutFeedback, Button, Text, View, Image, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import TopBar from '../components/TopBar'

export default NavigationTopBar = ({navigation}) => {
    _onBackPress = () => {
      navigation.goBack()
    }
      
      return (
        <TopBar isNavBar><View>
          <TouchableWithoutFeedback onPress={this._onBackPress}>
          <Image
            style={styles.topBarIcon}
            source={require('../res/images/back.png')}/>
            </TouchableWithoutFeedback>
          </View>
        </TopBar>
      );
}

const styles = StyleSheet.create({
  topBarIcon: {
    height: 40,
    width: 40,
    marginTop: 4,
    marginLeft: 5,
    
  },
});
