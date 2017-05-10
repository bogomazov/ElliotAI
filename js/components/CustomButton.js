//
// Copyright (c) 2016 by Elliot Team. All Rights Reserved. @flow
//
import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { themeColor } from '../res/values/styles'

// export type Prop = {
//   isHeader: bool,
//   task: Task,
//   onTextChange: (task: Task, text: string) => void,
//   onToggleCheckbox: (task: Task) => void,
// }

// {native && <Button
//   onPress={onPress}
//   title={title}
//   color={color}
// />}

const CustomButton = ({onPress, title, style, isWhite}) => {
      let textStyle = [styles.buttonWrapper]
      if (isWhite) {
          textStyle.push(styles.white)
      }
      console.log(textStyle)
      return (
        <View style={style}>
            <TouchableHighlight onPress={onPress} underlayColor={themeColor}>
              <Text style={styles.text}>{title}</Text>
            </TouchableHighlight>
            {/* <View style={styles.buttonWrapper}>

          </View> */}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {

    },

    buttonWrapper: {
      borderRadius: 10,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: themeColor,
    },

    text: {
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: themeColor,
      color: themeColor,
      fontSize: 14,
      padding: 7
    },

    white: {
      color: 'white',
      borderColor: 'white',
    }




});

export default CustomButton;
