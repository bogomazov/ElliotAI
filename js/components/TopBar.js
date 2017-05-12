import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';

export default TopBar = ({children}) => {
      return (
        <View style={styles.container}>
          {children}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      height: 45,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9F9F9',
      borderBottomColor: '#CBCBCF',
      borderBottomWidth: 1,
      borderStyle: 'solid',
  }
});
