import { StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import React, { Component, PropTypes } from 'react';
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
