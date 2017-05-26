//
// Copyright (c) 2016 by Elliot Team. All Rights Reserved. @flow
//
import { StyleSheet, TouchableWithoutFeedback, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { themeColor } from '../res/values/styles'

const CustomButton = ({onPress, title, style, isWhite}) => {

      return (
            <TouchableWithoutFeedback onPress={onPress} underlayColor={themeColor}>
              <View>
                <Text style={[styles.text, style, isWhite && styles.white]}>{title}</Text>
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
      fontSize: 14,
      padding: 5
    },

    white: {
      color: 'white',
      borderColor: 'white',
    }
});

export default CustomButton;
