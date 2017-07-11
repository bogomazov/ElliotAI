import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import {themeColor} from '../res/values/styles'

export default ProgressBar = () => {
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
});
