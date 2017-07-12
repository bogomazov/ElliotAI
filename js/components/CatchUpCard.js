import { StyleSheet, TouchableWithoutFeedback, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import s from '../res/values/styles'
import Arrow from './Arrow'
import Card from './Card'

export default CatchUpCard = ({onPress}) => {
      return (

          <Card>
            <TouchableWithoutFeedback onPress={onPress}>
              <View>
                <View style={[s.column, s.padding15]} >
                  <Text style={[s.textColorTheme, {fontSize: 18, fontWeight: "800"}]}>Who do you want to see?</Text>
                </View>
                <Arrow/>
            </View>
            </TouchableWithoutFeedback>
          </Card>
      );
}
