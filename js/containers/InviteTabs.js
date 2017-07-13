import {
  TouchableWithoutFeedback,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import s from '../res/values/styles';

export const ICON_UNACTIVE = 0
export const ICON_ACTIVE = 1

export default InviteTabs = ({activeTab, icons, onTabPress}) =>
      <View style={styles.container}>
        {icons.map((icon, i) =>
          {
            let tabStyles = [styles.tab]
            console.log(activeTab)
            if (i == activeTab) {
              tabStyles.push(s.borderTop)
              tabStyles.push(styles.activeTab)
            }

            if (i != 0) {
              tabStyles.push(styles.borderLeft)
            }

            return <TouchableWithoutFeedback key={i} onPress={() => onTabPress(i)}>
              <View style={tabStyles}>
                <Image
                      style={styles.icon}
                      source={icon}/>
              </View>
            </TouchableWithoutFeedback>
          }

          )}

      </View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  tab: {
    backgroundColor: '#EFEFF4',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    height: 60,
  },

  borderLeft: {
    marginLeft: 1
  },

  icon: {
    height: 40,
    width: 40
  },


  activeTab: {
    backgroundColor: 'white',
  }
});
