import { StyleSheet, TouchableWithoutFeedback, Text, View } from 'react-native';
import React, { Component } from 'react';
import Arrow from './Arrow'
import Card from './Card'
import RemoteImage from './RemoteImage';
import s from '../res/values/styles';

const borderWidth = 1

export default MeetingCard = ({meeting, onPress}) => {

  console.log(meeting)
      return (
        <Card>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => onPress(meeting)}>
                <View style={[s.row, s.stretch, s.alignItemsCenter, {marginTop: 5, marginBottom: 5}]}>

                  <RemoteImage
                    style={styles.avatar}
                    source={{ uri: meeting.friend.image}}/>
                  <View style={[s.column, {marginRight: 50}]}>
                    <Text style={[s.bold, styles.title]}>{meeting.meeting_type} with {meeting.friend.first_name} {meeting.friend.last_name}</Text>
                    <Text style={[s.light, styles.subtitle]}>{meeting.getDateStr()}</Text>
                    <Text style={[s.light, styles.subtitle]}>{meeting.meeting_time.format("h:mm A")}</Text>
                  </View>
                  <Arrow />

                </View>
            </TouchableWithoutFeedback>
          </View>
        </Card>
      );
}

// MeetingCard.propTypes = {
//   meeting: PropTypes.objectOf(Meeting)
// }

// export default MeetingCard

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignSelf: 'stretch',
      padding: 10
    },
    title: {
      fontSize: 17,
      marginRight: 35,
    },
    subtitle: {
      fontSize: 15,
      marginRight: 15,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginTop: 0,
      marginRight: 10,
    }
});
