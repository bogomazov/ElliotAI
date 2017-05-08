//
// Copyright (c) 2016 by Simplist Team. All Rights Reserved. @flow
//
import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';

// export type Prop = {
//   isHeader: bool,
//   task: Task,
//   onTextChange: (task: Task, text: string) => void,
//   onToggleCheckbox: (task: Task) => void,
// }

const CustomButton = ({onPress, title, styleContainer, native, color}) => {
      const style = [styles.container, styleContainer]
      return (
        <View style={style}>
          {native && <Button
            onPress={onPress}
            title={title}
            color={color}
          />}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {

    },
});

export default CustomButton;
