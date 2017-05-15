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
  }
});
