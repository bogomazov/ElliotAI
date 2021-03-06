import { StyleSheet, Text, View } from 'react-native';
import React, {Component} from 'react';
import CustomButton from './CustomButton'
import CustomModal from './CustomModal';

export default AlertDialog = ({title, description, isOpen, onClosed, onSuccess, onSuccessTitle, onCancelTitle}) => {
      console.log(onSuccess)
      return (
        <CustomModal isOpen={isOpen}>
          <Text style={[s.bold]}>{title}</Text>
          <Text style={[s.marginTop10]}>{description}</Text>
          <View style={[s.row, s.alignItemsCenter, s.justifyContentCenter, {height: 50}]}>
            <CustomButton
              onPress={onClosed}
              title={onCancelTitle}
              style={[s.margin10, s.flex, {width: 100}]}
            />
            {onSuccess && <CustomButton
              onPress={onSuccess}
              title={onSuccessTitle}
              style={[s.margin10, s.flex, {width: 100}]}
            />}
          </View>
        </CustomModal>
      );
}

const styles = StyleSheet.create({
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
