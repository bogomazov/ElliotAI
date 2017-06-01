'use strict';

//import App from './js/index'

import React from 'react';
import codePush from "react-native-code-push";

import {
  Text,
  StyleSheet,
  AppRegistry,
  View,
  TouchableOpacity,
  NativeModules,
} from 'react-native';

class ReactTest extends React.Component {
  componentDidMount() {
    codePush.sync({installMode: codePush.InstallMode.ON_NEXT_RESUME});
  }

  onButtonPress() {
      codePush.sync({
          updateDialog: true,
          installMode: codePush.InstallMode.IMMEDIATE
      });
  }

  onBackPress() {
    NativeModules.ReactTestConnector.tappedBack(this.props.rootTag);
  }

  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity onPress={this.onButtonPress}>
              <Text style={styles.text}>Check for updates</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.onBackPress()}}>
              <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
});

// Module name
AppRegistry.registerComponent('ReactTest', () => ReactTest);