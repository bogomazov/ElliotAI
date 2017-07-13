//
// Copyright (c) 2016 by Elliot Team. All Rights Reserved. @flow
//
import { StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import React, { Component } from 'react';
import { themeColor, themeColorThird } from '../res/values/styles'

const CustomButton = ({onPress, title, style, isWhite, isActive, isFilled, isFilledGreen}) => {

      return (
            <TouchableWithoutFeedback onPress={onPress} underlayColor={themeColor}>
              <View>
                <Text style={[styles.text, style, isWhite && styles.white, isFilled && styles.filled, isFilledGreen && styles.filledGreen]}>{title}</Text>
              </View>
            </TouchableWithoutFeedback>
      );
}

const styles = StyleSheet.create({
    text: {
      alignSelf: 'center',
      textAlign: 'center',
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: themeColor,
      color: themeColor,
      fontSize: 16,
      padding: 5,
      overflow: 'hidden',
      fontFamily: 'OpenSans-ExtraBold'
    },

    white: {
      color: 'white',
      borderColor: 'white',
    },

    filled: {
      color: 'white',
      backgroundColor: themeColor,
    },

    filledGreen: {
      color: 'white',
      backgroundColor: themeColorThird,
    }
});

export default CustomButton;
