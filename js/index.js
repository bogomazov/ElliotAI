/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  NativeModules,
} from 'react-native';

import { connect, Provider } from 'react-redux'
// import { connect, Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, bindActionCreators } from 'redux'
import {createLogger}  from 'redux-logger'
import thunk  from 'redux-thunk'
import rootReducer  from './state/reducers/index'
// import * as storage from 'redux-storage'
import {persistStore, autoRehydrate} from 'redux-persist'
import MainScene from './scenes/MainScene'
import ScheduleScene from './scenes/ScheduleScene'
import UserSuggestionsScene from './scenes/UserSuggestionsScene'
import FriendsScene from './scenes/FriendsScene'
import codePush, {InstallMode} from "react-native-code-push";

import {getAPI} from './network/networkManager'
import { StackNavigator } from 'react-navigation';
import DeepLinking from 'react-native-deep-linking';
import {IS_IOS} from './settings'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {newAccessToken} from './state/actions/app'

// Disable font scaling to prevent breaking the layout
Text.defaultProps.allowFontScaling = false;

// export const IS_DEV = true

// call for IOS
if (IS_IOS) {
  Ionicons.loadFont()
  Entypo.loadFont()
  EvilIcons.loadFont()
}

DeepLinking.addScheme('elliot://');

export const Store = createStore(
  rootReducer,
  undefined,
  compose(
    autoRehydrate(),
    applyMiddleware(thunk.withExtraArgument(getAPI), createLogger()),
  ))

// use .purge() to clean storage
const Persistor = persistStore(Store, { storage: AsyncStorage })
// Persistor.purge()
let persistStateConfig = {
  serialize: (collection) => {
    return JSON.stringify(collection, function (k, v) {
      if (typeof v === 'string' && v.match(RE_ISO_DATE)) {
        return 'moment:' + moment(v).valueOf()
      }
      return v
    })
  },
  deserialize: (serializedData) => {
    return JSON.parse(serializedData, function (k, v) {
      if (typeof v === 'string' && v.includes('moment:')) {
        return moment(parseInt(v.split(':')[1], 10))
      }
      return v
    })
  }
}


const Navigation = StackNavigator({
              MainScene: {screen: MainScene},
              ScheduleScene: {screen: ScheduleScene},
              UserSuggestionsScene: {screen: UserSuggestionsScene},
              FriendsScene: {screen: FriendsScene},
            }, {headerMode: 'none',
               transitionConfig: () => {duration: 500}})
class App extends Component {
  componentWillMount() {
    if (IS_IOS) {
      const accessToken = this.props.nativeIOS.accessToken
      Store.dispatch(newAccessToken(accessToken))
    }
  }

  render() {
    return (
      <Provider store={Store}>
        <Navigation/>
       </Provider>
    );
  }
}

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};
AppRegistry.registerComponent('Elliot', () => codePush(codePushOptions)(App));

export default App;
