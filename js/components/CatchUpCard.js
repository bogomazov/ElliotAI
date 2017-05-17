import { StyleSheet, TouchableWithoutFeedback, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import s, { themeColor, mainBackgroundColor } from '../res/values/styles'
import Arrow from './Arrow'
import Card from './Card'

export default CatchUpCard = ({onPress}) => {
      return (

          <Card style={styles.container}>
            <TouchableWithoutFeedback onPress={onPress}>
              <View>
                <View style={[s.column, s.padding10]} >
                  <Text style={[s.bold, s.textColorTheme]}>I want to catch up with...</Text>
                  <Text style={[s.textColorGrey, s.marginTop5]}>Select the friend you would like to see</Text>
                </View>
                <Arrow/>
            </View>
            </TouchableWithoutFeedback>
          </Card>
      );
}

const styles = StyleSheet.create({
    container: {
      borderColor: themeColor,
      borderWidth: 2,
      borderStyle: 'solid'
    },
    text: {
      flex: 1,
      color: 'white',
      margin: 5,
      padding: 5
    }
});
