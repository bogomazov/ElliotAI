import React from 'react'
import {
  Text,
  View,
  Image
} from 'react-native'
import Swiper from 'react-native-swiper'

var styles = {
  wrapper: {
    flex: 1,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#92BBD9'
  },
  text: {
    color: '#000',
    fontSize: 16,
    // fontWeighset: 'bold'
  }
}

export default () => <Swiper style={styles.wrapper} showsButtons>
  <View style={styles.slide1}>
    <Text style={styles.text}>Elliot suggests people and time for you to meet</Text>
    <Image
      style={{width: 100, height: 100}}
      source={require('../assets/images/Icon-40@3x.png')}/>
  </View>
  <View style={styles.slide2}>
    <Text style={styles.text}>Beautiful</Text>
    <Image
      style={{width: 100, height: 100}}
      source={require('../assets/images/Icon-40@3x.png')}/>
  </View>
  <View style={styles.slide3}>
    <Text style={styles.text}>And simple</Text>
    <Image
      style={{width: 100, height: 100}}
      source={require('../assets/images/Icon-40@3x.png')}/>
  </View>
</Swiper>
