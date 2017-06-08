import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
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
      height: 45,
      width: '100%',
  },
  mainScene: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderBottomColor: '#CEC19B',
      borderBottomWidth: 2,
      borderStyle: 'solid',
  },
  navBar: {
    backgroundColor: 'white',
//     alignSelf: 'stretch',
  }
});
