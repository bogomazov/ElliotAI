import React, { Component } from 'react'
import { AppRegistry, TouchableWithoutFeedback, View, Image, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, TextInput, Button } from 'react-native'

export const ICON_UNACTIVE = 0
export const ICON_ACTIVE = 1

export default class BottomNav extends Component {

  render = () =>
      <View style={styles.container}>
        <View style={styles.sceneWrapper}>
          {React.cloneElement(this.props.children[this.props.activeTab], { switchTab: this.props.onTabSelect, navigation: this.props.navigation})}
        </View>
        <View style={styles.bottomNav}>
        {React.Children.map(this.props.children,
          (child, i) => {
            console.log(i)
            console.log(child.props.iconActive)
           return <TouchableWithoutFeedback onPressIn={() => this.props.onTabSelect(i)}>
            <View style={styles.inner_container}>
              <View>
                <Image
                style={[styles.icon, s.margin10]}
                source={i == this.props.activeTab? child.props.iconActive: child.props.icon}/>
                <Text style={styles.contactAvatar}>2</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>})}
          </View>
      </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  sceneWrapper: {
    flex: 1,
    backgroundColor: '#EFEFF4'
  },
  inner_container: {
    flex: 1,
    alignItems: 'center',
  },
  bottomNav: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopColor: '#CBCBCF',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  icon: {
    height: 28,
    width: 28
  },
  contactAvatar: {
    position: 'absolute',
		width: 20,
		height: 20,
    top: 5,
    right: 0,
		justifyContent: 'center',
		textAlign: 'center',
		borderRadius: 20,
		color: 'white',
		backgroundColor: '#B4BBBE',
	},
});
