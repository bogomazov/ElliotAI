import React, { Component } from 'react'
import { AppRegistry, TouchableWithoutFeedback, View, Image, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal, TextInput, Button } from 'react-native'

export const ICON_UNACTIVE = 0
export const ICON_ACTIVE = 1

export default class BottomNav extends Component {
  state = {
    activeTab: 0
  }

  _switchTab = (sceneId) => {
    this.setState({activeTab: sceneId})
  }

  render = () =>
      <View style={styles.container}>
        <View style={styles.sceneWrapper}>
          {React.cloneElement(this.props.children[this.state.activeTab], { switchTab: this._switchTab })}
        </View>
        <View style={styles.bottomNav}>
        {React.Children.map(this.props.children,
          (child, i) => {
            console.log(i)
            console.log(child.props.iconActive)
           return <TouchableWithoutFeedback onPress={() => this._switchTab(i)}>
            <View style={styles.inner_container}>
              <Image
                style={styles.icon}
                source={i == this.state.activeTab? child.props.iconActive: child.props.icon}/>
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopColor: '#CBCBCF',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  icon: {
    height: 30,
    width: 30
  }
});
