import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight, Platform } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';

export default TopBar = ({isMainScene, isNavBar, children}) => {
    const container = [styles.container]
    if (isMainScene) {
      container.push(styles.mainScene)
    }
    if (isNavBar) {
      container.push(styles.navBar)
    }
    console.log(container)

      return (
        <View style={container}>
          {children}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      height: (Platform.OS === 'ios') ? 65 : 45,
      width: '100%',
  },
  mainScene: {
      flexDirection: 'row',
      alignItems: (Platform.OS === 'ios') ? 'flex-end' : 'center',
      justifyContent: 'center',
      backgroundColor: '#F9F9F9',
      borderBottomColor: '#CBCBCF',
      borderBottomWidth: 1,
      borderStyle: 'solid',
  },
  navBar: {
    backgroundColor: 'white',
//     alignSelf: 'stretch',
  }
});
