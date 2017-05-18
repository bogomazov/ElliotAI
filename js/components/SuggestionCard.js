import { StyleSheet, TouchableWithoutFeedback, Image, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Card from './Card'
import CustomButton from './CustomButton'
import Arrow from './Arrow'
import strings from '../res/values/strings'
import { themeColor, mainBackgroundColor } from '../res/values/styles'


const borderWidth = 1

export default SuggestionCard = ({suggestion, onPress, onMoreOptionsPress, onShowLessPress, withOptions}) => {
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
                    source={suggestion.getIcon()}/>
                  <Text>{suggestion.getDateStr()}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Arrow />
          </View>
          {withOptions && <View style={[styles.row, styles.buttonOptionsWrapper]}>
              <TouchableWithoutFeedback onPress={() => onMoreOptionsPress(suggestion)}>
                <View style={styles.buttonWrapper}>
                  <Text style={styles.optionButton}>
                    More Options
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            <View style={styles.verticalBorder} ></View>
              <TouchableWithoutFeedback onPress={() => onShowLessPress(suggestion)}>
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
      marginRight: 20,
      fontSize: 15,
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

    buttonWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',

    },
    optionButton: {
//       flexDirection: 'row',
      color: themeColor,
      textAlign: 'center',
      padding: 10,

    },
    verticalBorder: {
      width: borderWidth,
      height: '100%',
      backgroundColor: mainBackgroundColor,
    },

    buttonOptionsWrapper: {
      borderTopColor: mainBackgroundColor,
      borderTopWidth: borderWidth,
      borderStyle: 'solid',

    }
});
