import React, { Component } from 'react'
import { AppRegistry, TouchableWithoutFeedback, View, Image, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, TextInput, Button } from 'react-native'
import {themeColor} from '../res/values/styles'

export const ICON_UNACTIVE = 0
export const ICON_ACTIVE = 1

export default InviteTabs = ({activeTab, icons, onTabPress}) =>
      <View style={styles.container}>
        {icons.map((icon, i) =>
          <TouchableWithoutFeedback onPress={() => onTabPress(i)}>
            <View style={styles.tab}>
              <Image
                    style={styles.icon}
                    source={icon}/>
            </View>
          </TouchableWithoutFeedback>
          )}

      </View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  tab: {
    backgroundColor: '#EFEFF4'
  },
  icon: {
    height: 30,
    width: 30
  },
  activeTab: {
    backgroundColor: 'white',
    borderTopColor: themeColor,
    borderTopWidth: 2,
    borderStyle: 'solid',
  }
});
