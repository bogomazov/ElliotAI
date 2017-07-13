import { StyleSheet, Text, View } from 'react-native';
import React, { Component } from 'react';
import { themeColor } from '../res/values/styles'

import Icon from 'react-native-vector-icons/Ionicons';

export default IntroLabel = ({text, onClosePress}) => {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>{text}</Text>
          <Icon.Button name="md-close" color="#fff" backgroundColor={themeColor} size={30} onPress={onClosePress}/>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: themeColor,
      alignSelf: 'stretch',
      alignItems: 'center'
    },
    text: {
      flex: 1,
      color: 'white',
      margin: 5,
      padding: 5
    }
});
