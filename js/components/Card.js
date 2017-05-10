import { StyleSheet, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';

export default Card = ({children}) => {
      return (
        <View style={styles.container}>
          {children}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      borderRadius: 10,
      backgroundColor: 'white',
      margin: 10
      // width: '92%',
      // marginTop: '8%'
      // left: 10,
      // right: 10
    },
});
