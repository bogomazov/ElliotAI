import { StyleSheet, Image, Text, View } from 'react-native';
import React, { Component } from 'react';
import Card from './Card'
import CustomButton from './CustomButton'
import strings from '../res/values/strings'

export default TellFriendsCard = ({onPress, isMoreFriends}) => {
  console.log(onPress)
      return (
        <Card style={{marginBottom: 15}}>
          <View style={styles.container}>
            {!isMoreFriends &&
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
            }
            {isMoreFriends &&
              <Text style={styles.moreFriends}>
                {strings.tellMoreFriends}
              </Text>
            }
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
      marginBottom: 15,
      fontSize: 16,
      fontFamily: 'OpenSans-ExtraBold',
    },
    moreFriends: {
      margin: 10,
      marginTop: 15,
      textAlign: 'center',
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: 16,
    }
});
