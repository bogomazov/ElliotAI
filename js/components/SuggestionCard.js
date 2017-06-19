import { StyleSheet, TouchableWithoutFeedback, Image, Button, Text, View, TextInput, TouchableHighlight, ActivityIndicator } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Card from './Card'
import CustomButton from './CustomButton'
import Arrow from './Arrow'
import strings from '../res/values/strings'
import { themeColor, mainBackgroundColor, themeColorLight } from '../res/values/styles'
import RemoteImage from './RemoteImage';

const borderWidth = 2

export default SuggestionCard = ({suggestion, onPress, onMoreOptionsPress, onShowLessPress, withOptions, animateShowLess}) => {
  console.log(suggestion)

      return (
        <Card>
          <View style={styles.container}>
              <TouchableWithoutFeedback onPress={() => onPress(suggestion)}>
              <View>
                <View style={styles.row}>
                  <Text style={styles.title}>{suggestion.meeting_type} with {suggestion.friend.first_name} {suggestion.friend.last_name}</Text>
                  <RemoteImage
                    style={styles.avatar}
                    source={{ uri: suggestion.friend.image}}/>
                </View>
                <View style={styles.row}>
                  <Image
                    style={styles.type}
                    source={suggestion.getIcon()}/>
                  <Text style={styles.date}>{suggestion.getDateStr()}</Text>
                </View>
                <Arrow />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {withOptions && <View style={[styles.row, styles.buttonOptionsWrapper]}>
              <TouchableHighlight style={styles.buttonWrapper} underlayColor={themeColorLight} onPress={() => onMoreOptionsPress(suggestion)}>
                <View>
                  <Text style={styles.optionButton}>
                    More Options
                  </Text>
                </View>
              </TouchableHighlight>
            <View style={styles.verticalBorder} ></View>
              <TouchableHighlight underlayColor={themeColorLight} style={styles.buttonWrapper} underlayColor={themeColorLight} onPress={() => onShowLessPress(suggestion)}>
                <View>
                  {animateShowLess &&
                    <ActivityIndicator animating={true} color={themeColor} size="small" style={styles.activityIndicator}/>
                  }
                  {!animateShowLess &&
                    <Text style={styles.optionButton}>
                      Show Less of {suggestion.friend.first_name}
                    </Text>
                  }
                </View>
              </TouchableHighlight>
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

    date: {
      fontFamily: "OpenSans-Light",
      fontSize: 17
    },
    title: {
      flex: 1,
      margin: 10,
      marginLeft: 15,
      marginRight: 20,
      fontSize: 17,
      fontFamily: 'OpenSans-Bold',
      color: 'black'
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginTop: 10,
      marginRight: 30,
    },
    type: {
      width: 50,
      height: 50,
      margin: 10
    },

    buttonWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 58,
    },
    optionButton: {
//       flexDirection: 'row',
      color: themeColor,
      textAlign: 'center',
      padding: 10,
      fontFamily: 'OpenSans-Bold'
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
    },
    activityIndicator: {
      flex: 1,
  		justifyContent: 'center',
  		alignItems: 'center',
    }
});
