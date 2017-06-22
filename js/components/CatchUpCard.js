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
                  <Text style={[s.textColorTheme, {fontSize: 20, fontWeight: "800"}]}>I want to catch up with...</Text>
                  <Text style={[s.textColorGrey, s.marginTop5, {fontSize: 14}]}>Select the friend you'd like to see</Text>
                </View>
                <Arrow/>
            </View>
            </TouchableWithoutFeedback>
          </Card>
      );
}
