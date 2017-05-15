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

import {getAPI} from './network/networkManager'
import { StackNavigator } from 'react-navigation';

export const Store = createStore(
  rootReducer,
  undefined,
  compose(
    autoRehydrate(),
    applyMiddleware(thunk.withExtraArgument(getAPI), createLogger()),
  ))


// use .purge() to clean storage
persistStore(Store, { storage: AsyncStorage })


const Navigation = StackNavigator({
              MainScene: {screen: MainScene},
              ScheduleScene: {screen: ScheduleScene},
              UserSuggestionsScene: {screen: UserSuggestionsScene},
            }, {headerMode: 'none'})
class App extends Component {
    render() {
        return (
          <Provider store={Store}>
            <Navigation/>
           </Provider>
        );
    }
}



AppRegistry.registerComponent('Elliot', () => App);

export default App;
