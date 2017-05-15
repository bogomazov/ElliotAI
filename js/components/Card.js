import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';

export default Card = ({children, style}) => {
      return (
        <View style={[styles.container, style]}>
          {children}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      borderRadius: 10,
      backgroundColor: 'white',
      alignSelf: 'stretch',
      margin: 10,
    },
});
