import React, {Component} from 'react'
import {View, Text, StyleSheet, Switch} from 'react-native'
import SettingsRow from './SettingsRow'
import s, {mainBackgroundColor} from '../res/values/styles'
import IconIon from 'react-native-vector-icons/Ionicons'

export default SettingsAccountRow = ({account, isExpanded, setIsEnabled, getIsEnabled, onExpand}) => {
  return (
    <View>
      <SettingsRow onPress={onExpand}>
        <Text style={[s.bold, s.textColorTheme, {fontSize: 16}]}>{account.name}</Text>
        <IconIon
          name={isExpanded ? "ios-arrow-down" : "ios-arrow-forward"}
          size={20}
          color="black"
          style={{marginLeft: 5, marginTop: 5, marginRight: 3}}
        />
      </SettingsRow>
      {isExpanded &&
        account.calendars.map(cal =>
          <View style={styles.calendar} key={cal.calendar_id}>
            <Text style={styles.calendarTitle}>{cal.name}</Text>
            <Switch
              onValueChange={(value) => setIsEnabled(cal, value)}
              value={getIsEnabled(cal)}
            />
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    paddingLeft: 30,
    borderTopWidth: 1,
    borderTopColor: mainBackgroundColor,
  },
  calendarTitle: {
    fontSize: 15,
    fontFamily: 'OpenSans-Light',
  }
})
