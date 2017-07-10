import React, {Component} from 'react'
import {View, StyleSheet, TouchableHighlight} from 'react-native'

export default SettingsRow = ({children, style, onPress}) => {
  return (
    <TouchableHighlight underlayColor="grey" onPress={onPress}>
      <View style={[styles.default, style]}>
        {children}
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 20,
  }
})
