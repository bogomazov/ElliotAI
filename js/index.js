/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { AsyncStorage, AppRegistry, Text } from 'react-native';
import { applyMiddleware, compose, createStore, bindActionCreators } from 'redux'
import { connect, Provider } from 'react-redux'
import {createLogger}  from 'redux-logger'
import {persistStore, autoRehydrate} from 'redux-persist'
import DeepLinking from 'react-native-deep-linking';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { Component } from 'react';
import codePush from 'react-native-code-push';
import moment from 'moment';
import thunk  from 'redux-thunk'
import {IS_IOS, IS_REDUX_LOGGER_ENABLED, IS_DEV} from './settings'
import {getAPI} from './network/networkManager'
import LandingScene from './scenes/LandingScene';
import SplashScene from './scenes/SplashScene';
import * as appActions from './state/actions/app';
import rootReducer  from './state/reducers/index'

// Override console logs to improve performance on prod.
if (!IS_DEV || !__DEV__) {
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
  render() {
    console.log(this.props);
    return (
      <Provider store={Store}>
        <Rehydrator nativeIOS={this.props.nativeIOS}/>
       </Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isRehydrated: state.app.isRehydrated,
    didMigrateIOSData: state.app.didMigrateIOSData,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {appActions: bindActionCreators(appActions, dispatch)}
}

@connect(mapStateToProps, mapDispatchToProps)
class Rehydrator extends Component {
  // MARK Migrate native iOS data for users who updated their app.
  componentDidMount() {
    if (IS_IOS && this.props.isRehydrated) {
      this.migrateIOSData()
    }
  }

  componentDidUpdate() {
    if (IS_IOS && this.props.isRehydrated) {
      this.migrateIOSData()
    }
  }

  migrateIOSData = () => {
    if (!this.props.didMigrateIOSData) {
      console.log(this.props.nativeIOS)
      const {accessToken, hasVerifiedNumber} = this.props.nativeIOS
      if (accessToken) {
        this.props.appActions.newAccessToken(accessToken)
      }
      if (hasVerifiedNumber === true) {
        this.props.appActions.phoneVerified()
      }
      this.props.appActions.migratedIOSData()
    }
  }

  render() {
    console.log(this.props);
    if (!this.props.isRehydrated ||
      (IS_IOS && !this.props.didMigrateIOSData)) {
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
