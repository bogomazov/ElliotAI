/**
 * Created by andrey on 10/18/16.
 @flow
 */
import { Image, View, StyleSheet } from 'react-native';
import React, { Component } from 'react'
import {IS_DEV, IS_IOS, IS_ANDROID} from '../settings'
import {mainBackgroundColor} from '../res/values/styles';

export default class SplashScene extends Component {
  render() {
      if (IS_DEV && IS_ANDROID) {
        alert('Staging server!')
      }
      if (IS_IOS) {
        return (<View style={styles.iosContainer}></View>);
      }
      return (<View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../res/images/launch_logo.png')}/>
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iosContainer: {
    flex: 1,
    backgroundColor: mainBackgroundColor
  },
  swiper: {
  },
  button: {
    height: 200
  },
  image: {
    width: 200,
    height: 300
  }
});
