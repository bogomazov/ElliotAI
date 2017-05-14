import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';

export default TopBar = ({isMainScene, isNavBar, children}) => {
    const container = [styles.container]
    console.log(isMainScene)
    if (isMainScene) {
      container.push(styles.mainScene)
    }
  console.log(container)
  
    if (isNavBar) {
      container.push(styles.isNavBar)
    }
      return (
        <View style={container}>
          {children}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      height: 45,
      width: '100%',
  },
  mainScene: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F9F9F9',
      borderBottomColor: '#CBCBCF',
      borderBottomWidth: 1,
      borderStyle: 'solid',
  },
  navBar: {
    backgroundColor: 'white',
  }
});
