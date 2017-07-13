import Modal from 'react-native-simple-modal';
import { StyleSheet } from 'react-native';
import React, { Component } from 'react';

export default CustomModal = ({children, isOpen}) => <Modal
          open={isOpen}
          offset={0}
          overlayBackground={'rgba(0, 0, 0, 0.75)'}
          animationDuration={200}
          animationTension={40}
          modalDidOpen={() => undefined}
          modalDidClose={() => undefined}
          closeOnTouchOutside={false}
          containerStyle={{
             justifyContent: 'center'
          }}
          modalStyle={{
             borderRadius: 2,
             margin: 20,
             padding: 10,
             backgroundColor: '#F5F5F5'
          }}
        disableOnBackPress={true}>
        {children}
      </Modal>


const styles = StyleSheet.create({
    container: {
      borderRadius: 10,
      backgroundColor: 'white',
      alignSelf: 'stretch',
      margin: 10,
    },
});
