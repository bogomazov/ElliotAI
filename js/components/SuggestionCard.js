import { StyleSheet, TouchableWithoutFeedback, Image, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Card from './Card'
import CustomButton from './CustomButton'
import strings from '../res/values/strings'
import { themeColor, mainBackgroundColor } from '../res/values/styles'
import {getDay, getMonth} from '../utils/DateTime'
TYPE_CALL = "Call"

const _getIcon = (suggestion) => {
  switch(suggestion.meeting_type) {
    case TYPE_CALL:
      return require('../res/images/call-66px.png')
  }
}

const borderWidth = 1

export default SuggestionCard = ({suggestion, onPress, onMoreOptionsPress, OnShowLessPress, withOptions}) => {
  console.log(suggestion)
      return (
        <Card>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => onPress(suggestion)}>
              <View>
                <View style={styles.row}>
                  <Text style={styles.title}>{suggestion.meeting_type} with {suggestion.friend.first_name} {suggestion.friend.last_name}</Text>
                  <Image
                    style={styles.avatar}
                    source={{ uri: suggestion.friend.image}}/>
                </View>
                <View style={styles.row}>
                  <Image
                    style={styles.type}
                    source={_getIcon(suggestion)}/>
                  <Text>{getDay(suggestion.meeting_time)}, {getMonth(suggestion.meeting_time)} {suggestion.meeting_time.getDate()}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.arrowWrapper}>
              <Image
                style={styles.backArrow}
                source={require('../res/images/back-44px.png')}/>
            </View>
          </View>
          {withOptions && <View style={styles.row}>
            <TouchableWithoutFeedback onPress={() => onMoreOptionsPress(suggestion)}>
              <View style={styles.buttonWrapper}>
                <Text style={styles.optionButton}>
                  More Options
                </Text>
              </View>
            </TouchableWithoutFeedback>
          <View style={styles.verticalBorder} ></View>
            <TouchableWithoutFeedback onPress={() => OnShowLessPress(suggestion)}>
              <View style={styles.buttonWrapper}>
                <Text style={styles.optionButton}>
                  Show Less of {suggestion.friend.first_name}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>}
        </Card>
      );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignSelf: 'stretch',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    title: {
      flex: 1,
      marginRight: 20,
      margin: 10,
      fontSize: 18,
      fontFamily: 'OpenSans-Bold',
      color: 'black'
    },
    avatar: {
      width: 45,
      height: 45,
      borderRadius: 100,
      marginTop: 10,
      marginRight: 30,
    },
    type: {
      width: 40,
      height: 40,
      margin: 10
    },
    arrowWrapper: {
      justifyContent: 'center',
      position: 'absolute',
      right: 0,
  		top: 0,
      bottom: 0
    },
    backArrow: {
      width: 25,
      height: 25,
    },
    buttonWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopColor: mainBackgroundColor,
      borderTopWidth: borderWidth,
      borderStyle: 'solid',
    },
    optionButton: {
      flexDirection: 'row',
      color: themeColor,
      padding: 10
    },
    verticalBorder: {
      width: borderWidth,
      height: '100%',
      backgroundColor: mainBackgroundColor,
//       borderRightColor: mainBackgroundColor,
//       borderRightWidth: 1,
//       borderStyle: 'solid',
    }
});
