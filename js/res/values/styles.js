import { StyleSheet } from 'react-native';
import { setCustomText } from 'react-native-global-props';

export const themeColor = '#948763'
export const mainBackgroundColor = '#ECECF1'

const customTextProps = {
  style: {
    fontFamily: 'OpenSans-Regular'
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
  stretch: {
    alignSelf: 'stretch',
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  textThemeColor: {
    color: themeColor
  },
  borderTop: {
    borderTopColor: themeColor,
    borderTopWidth: 3,
    borderStyle: 'solid',
    flex: 1,
//     alignItems: 'flex-start',
  },
  avatar: {
      width: 45,
      height: 45,
      borderRadius: 100,
  },
  
  flex: {
    flex: 1
  },
  margin10: {
    margin: 10
  },
  marginTop10: {
    marginTop: 10
  },
  
  padding10: {
    padding: 10
  },
  
  
});
