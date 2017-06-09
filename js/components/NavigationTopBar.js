import { StyleSheet,TouchableWithoutFeedback, Button, Text, View, Image, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import TopBar from '../components/TopBar'
import s from '../res/values/styles'
import IconIon from 'react-native-vector-icons/Ionicons';

// ios-arrow-back

export default NavigationTopBar = ({navigation, title}) => {
    _onBackPress = () => {
      navigation.goBack()
    }

      return (
        <TopBar isNavBar>
          <View style={[s.row, styles.row]}>
            <View style={styles.iconWrapper}>
            <IconIon.Button style={styles.topBarIcon} name="ios-arrow-back" size={30} color='grey' backgroundColor="white" onPress={this._onBackPress}>
                {/* <Image
                style={styles.topBarIcon}
                source={require('../res/images/back.png')}/> */}
            </IconIon.Button>
          </View>
            <Text style={[s.alignItemsCenter, s.bold, s.textColorTheme, {fontSize: 16}]}>{title}</Text>
          </View>
        </TopBar>
      );
}

const styles = StyleSheet.create({
  iconWrapper: {
    left: 10,
    // top: 5,
    position: 'absolute',
  },
  topBarIcon: {
    // height: 35,
    // width: 35,
    // position: 'absolute',

    backgroundColor: 'white'
  },
  row: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
