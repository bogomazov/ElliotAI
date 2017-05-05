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
// console.log(API)
export const Store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(thunk.withExtraArgument(getAPI), createLogger()),
    autoRehydrate()
  ))

export const persistor = persistStore(Store, {}, () => {
  console.log('rehydration complete')
})

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
