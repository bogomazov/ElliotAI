import { StyleSheet, Button, Text, Image, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { themeColor, mainBackgroundColor } from '../res/values/styles'

import Icon from 'react-native-vector-icons/Ionicons';

export default Arrow = ({styleIcon}) => {
      return (
        <View style={styles.arrowWrapper}>
          <Image
            style={[styles.backArrow, styleIcon]}
            source={require('../res/images/back-44px.png')}/>
        </View>
      );
}

const styles = StyleSheet.create({
    arrowWrapper: {
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
  		top: 0,
      bottom: 0,
      // backgroundColor: 'black'
    },
    backArrow: {
      width: 30,
      height: 30,
    },
});
