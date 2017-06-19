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
import codePush, {InstallMode} from "react-native-code-push";
import {getAPI} from './network/networkManager'
import DeepLinking from 'react-native-deep-linking';
import {IS_IOS, IS_REDUX_LOGGER_ENABLED, IS_DEV} from './settings'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {ImageCache} from 'react-native-img-cache';

import {newAccessToken} from './state/actions/app';
import * as appActions from './state/actions/app';
import SplashScene from './scenes/SplashScene';
import LandingScene from './scenes/LandingScene';

// Override console logs to improve performance on prod.
if (!__DEV__) {
  console.log = () => {};
  console.error = () => {};
}
// Disable font scaling to prevent breaking the layout
Text.defaultProps.allowFontScaling = false;

// export const IS_DEV = true

// call for IOS
if (IS_IOS) {
  Ionicons.loadFont()
  Entypo.loadFont()
  EvilIcons.loadFont()
}

// Clear image cache on launch.
ImageCache.get().clear();

DeepLinking.addScheme('elliot://');

const reduxLogger = createLogger({
  predicate: (getState, action) => (IS_REDUX_LOGGER_ENABLED && IS_DEV)
});

export const Store = createStore(
  rootReducer,
  undefined,
  compose(
    autoRehydrate(),
    applyMiddleware(thunk.withExtraArgument(getAPI), reduxLogger),
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

class App extends Component {
  componentWillMount() {
    if (IS_IOS) {
      const accessToken = this.props.nativeIOS.accessToken
      Store.dispatch(newAccessToken(accessToken))
    }
  }

  render() {
    console.log(this.props);
    return (
      <Provider store={Store}>
        <Rehydrator/>
       </Provider>
    );
  }
}

const mapStateToProps = (state) => {
	return {app: state.app}
}
@connect(mapStateToProps)
class Rehydrator extends Component {
  render() {
    console.log(this.props);
    if (!this.props.app.isRehydrated) {
      return (<SplashScene/>);
    }
    return (<LandingScene/>);
  }
}

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};
AppRegistry.registerComponent('Elliot', () => codePush(codePushOptions)(App));

export default App;
