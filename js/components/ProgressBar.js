import { ActivityIndicator, StyleSheet,TouchableWithoutFeedback, Button, Text, View, Image, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import TopBar from '../components/TopBar'
import s, {themeColor} from '../res/values/styles'
import IconIon from 'react-native-vector-icons/Ionicons';

// ios-arrow-back

export default ProgressBar = ({}) => {
      return (
        <ActivityIndicator animating={true} color={themeColor} size="large" style={styles.activityIndicator}/>
      );
}

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
