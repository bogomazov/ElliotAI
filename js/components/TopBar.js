import { StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import {IS_IOS} from '../settings';

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
        <View>
          {IS_IOS && <View style={styles.iosStatusBar}></View>}
          <View style={container}>
            {children}
          </View>
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
  },
  iosStatusBar: {
    height: 20,
    backgroundColor: '#FFFFFF',
  }
});
