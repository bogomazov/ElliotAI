import React from 'react'
import {
  Text,
  View,
  Image
} from 'react-native'
import Swiper from 'react-native-swiper'
import strings from '../res/values/strings'
import s from '../res/values/styles'


// export default class LoginScene extends Component {
//   render() {
//     let introTexts =
//     let
//     return ();
//   }
// }

// images need to be statically included in RN
export default () =>
<View style={styles.wrapper}>
  <Swiper activeDotColor={'#808080'} loop autoplay autoplayDirection>
  {[[strings.login1, require('../res/images/login1.png')],
    [strings.login2, require('../res/images/login2.png')],
    [strings.login3, require('../res/images/login3.png')]].map((slide, i: number) =>
    <View key={i} style={styles.slide}>
      <View style={styles.textWrapper}>
        <Text style={[styles.text, s.nuxGrayText]}>{slide[0]}</Text>
      </View>
      <Image
        style={styles.image}
        source={slide[1]}/>
    </View>)}
</Swiper>
</View>

var styles = {
  wrapper: {

  },
  slide: {

    flex: 1,
    // height: 300,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // marginBottom: 30
    paddingBottom: 60
    // backgroundColor: '#9DD6EB'
  },

  textWrapper: {
    height: 40,
    marginBottom: 20,
  },

  text: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    width: 300,
    fontFamily: 'OpenSans-Light',
    marginBottom: 30,
  },
  image: {
    width: 230,
    height: 300
  },
  logoText: {
    flex: 1
  }
}
