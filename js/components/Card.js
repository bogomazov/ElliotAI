import { StyleSheet, View } from 'react-native';
import React, { Component } from 'react';

export default Card = ({children, style}) => {
      return (
        <View style={[styles.container, style]}>
          {children}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      borderRadius: 5,
      backgroundColor: 'white',
      alignSelf: 'stretch',
      marginLeft: 12,
      marginRight: 12,
      marginTop: 12,
      shadowColor: "#e8e8e8",
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowRadius: 25,
      shadowOpacity: 1,
      overflow: 'hidden',
    },
});
