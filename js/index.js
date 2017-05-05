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
  View
} from 'react-native';

import { connect, Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, bindActionCreators } from 'redux'
import {createLogger}  from 'redux-logger'
import thunk  from 'redux-thunk'
import rootReducer  from './state/reducers/index'
// import * as storage from 'redux-storage'
import {persistStore, autoRehydrate} from 'redux-persist'
import MainScene from './scenes/MainScene'

import {getAPI} from './network/networkManager'

import { StackNavigator } from 'react-navigation';

export const Store = createStore(
  rootReducer,
  {},
  compose(
    autoRehydrate(),
    applyMiddleware(thunk.withExtraArgument(getAPI), createLogger()),
  ))

// export const Store = createStore(
//   rootReducer,
//   applyMiddleware(thunk.withExtraArgument(getAPI), createLogger()),
//   autoRehydrate())

persistStore(Store, { storage: AsyncStorage })

// export const saveState = () => {
//   persistStore(Store, { storage: AsyncStorage })
// }

// saveState()

class App extends Component {
    render() {
        return (
          <Provider store={Store}>
            <MainScene/>
           </Provider>
        );
    }
}

AppRegistry.registerComponent('Elliot', () => App);

export default App;
