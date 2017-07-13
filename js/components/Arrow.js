import { StyleSheet, Image, View} from 'react-native';
import React, { Component } from 'react';

export default Arrow = ({styleIcon}) => {
      return (
        <View style={styles.arrowWrapper}>
          <Image
            style={[styles.backArrow, styleIcon]}
            source={require('../res/images/back-44px.png')}/>
        </View>
      );
}

const styles = StyleSheet.create({
    arrowWrapper: {
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      // backgroundColor: 'black'
    },
    backArrow: {
      width: 30,
      height: 30,
    },
});
