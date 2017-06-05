import { StyleSheet, TouchableWithoutFeedback, Image, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Card from './Card'
import CustomButton from './CustomButton'
import Arrow from './Arrow'
import strings from '../res/values/strings'
import Meeting from '../state/models/meeting'
import s, { themeColor, mainBackgroundColor } from '../res/values/styles'


const borderWidth = 1

const MeetingCard = ({meeting, onPress}) => {

  console.log(meeting)
      return (
        <Card>
          <View style={styles.container}>
              <TouchableWithoutFeedback onPress={() => onPress(meeting)}>
                <View style={[s.row, s.stretch, s.alignItemsCenter]}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: meeting.friend.image}}/>
                  <View style={s.column}>
                    <Text style={s.bold}>{meeting.meeting_type} with {meeting.friend.first_name} {meeting.friend.last_name}</Text>
                    <Text>{meeting.getDateStr()}</Text>
                    <Text>{meeting.meeting_time.format("h:mm A")}</Text>
                  </View>
                </View>
            </TouchableWithoutFeedback>
          <Arrow />
          </View>
        </Card>
      );
}

MeetingCard.propTypes = {
  meeting: PropTypes.objectOf(Meeting)
}

export default MeetingCard

const styles = StyleSheet.create({

    container: {
      flex: 1,
      flexDirection: 'column',
      alignSelf: 'stretch',
      padding: 10
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
      marginTop: 0,
      marginRight: 10,
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
});
