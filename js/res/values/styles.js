import { StyleSheet, Platform } from 'react-native';
import { setCustomText } from 'react-native-global-props';

export const themeColor = '#B3A784'
export const themeColorThird = '#3F9696'
export const themeColorLight = '#CEC19B'
export const mainBackgroundColor = '#F1F1F1'

const customTextProps = {
  style: {
    fontFamily: (Platform.OS === 'ios') ? 'OpenSans' : 'OpenSans-Regular'
  }
}
setCustomText(customTextProps);

export default s = StyleSheet.create({
  row: {
      flexDirection: 'row'
  },
  column: {
      flexDirection: 'column'
  },
  bold: {
    fontFamily: 'OpenSans-Bold'
  },
  light: {
    fontFamily: 'OpenSans-Light'
  },
  stretch: {
    alignSelf: 'stretch',
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  justifyContentCenter: {
    justifyContent: 'center'
  },

  // TEXT
  textColorTheme: {
    color: themeColor
  },
  textColorGrey: {
    color: '#BBBBBB'
  },
  textColorBlack: {
    color: 'black'
  },
  textColorWhite: {
    color: 'white'
  },
  textAlignCenter: {
    textAlign: 'center'
  },

  borderTop: {
    borderTopColor: themeColor,
    borderTopWidth: 3,
    borderStyle: 'solid',
//     alignItems: 'flex-start',
  },
  icon40: {
    width: 40,
    height: 40,
  },
  tabIcon: {
    width: 32,
    height: 32,
  },
  avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
  },
  avatar30: {
      width: 30,
      height: 30,
      borderRadius: 15,
  },
  borderTopGrey: {
    borderTopColor: '#E4E3E6',
    borderTopWidth: 1,
    borderStyle: 'solid',
  },

  flex: {
    flex: 1
  },
  margin10: {
    margin: 10
  },
  marginTop5: {
    marginTop: 5
  },
  marginTop10: {
    marginTop: 10
  },
  marginLeft10: {
    marginLeft: 10
  },
  marginRight10: {
    marginRight: 10
  },

  padding10: {
    padding: 10
  },
  padding15: {
    padding: 15
  }

});
