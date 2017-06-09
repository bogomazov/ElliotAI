import { StyleSheet, Image, Button, Text, View, TextInput, TouchableHighlight } from 'react-native';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import Card from './Card'
import CustomButton from './CustomButton'
import strings from '../res/values/strings'

export default TellFriendsCard = ({onPress}) => {
  console.log(onPress)
      return (
        <Card style={{marginBottom: 15}}>
          <View style={styles.container}>
            <View style={styles.iconsWrapper}>
              <Image
                style={styles.icon}
                source={require('../res/images/dinner-66px.png')}/>
              <Image
                style={styles.icon}
                source={require('../res/images/lunch-66px.png')}/>
              <Image
                style={styles.icon}
                source={require('../res/images/coffee-66px.png')}/>
              <Image
                style={styles.icon}
                source={require('../res/images/call-66px.png')}/>
            </View>
            <CustomButton
              style={styles.button}
              onPress={onPress}
              title={strings.tellFriends}
            />
          </View>
        </Card>
      );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconsWrapper: {
      flexDirection: 'row',
      width: '80%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      margin: 15
    },
    icon: {
      width: 50,
      height: 50,
      // margin: 10
    },
    button: {
      marginBottom: 25,
      fontSize: 17,
    }
});
