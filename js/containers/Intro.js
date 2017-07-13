import React from 'react'
import {
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native'
import Swiper from 'react-native-swiper'
import strings from '../res/values/strings'
import s from '../res/values/styles'

const VERTICAL_MARGIN = 200;
const SWIPER_HEIGHT = Dimensions.get('window').height - VERTICAL_MARGIN;

export default () =>
  <Swiper
    height={SWIPER_HEIGHT}
    activeDotColor={'#808080'}
    loop
    autoplay
    autoplayDirection
    autoplayTimeout={4}>
    {[[strings.login1, require('../res/images/login1.png')],
      [strings.login2, require('../res/images/login2.png')],
      [strings.login3, require('../res/images/login3.png')]].map((slide, i: number) =>
        <View key={i} style={styles.slide}>
          <Text style={[styles.text, s.nuxGrayText]}>{slide[0]}</Text>
          <Image
            style={styles.image}
            source={slide[1]}
            resizeMode="contain"
          />
        </View>
      )
    }
  </Swiper>

var styles = {
  slide: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 40,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 50
  },
  image: {
    flex: 7,
  },
}
