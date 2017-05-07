//
// Copyright (c) 2016 by Simplist Team. All Rights Reserved. @flow
//
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { CheckboxField, Checkbox } from 'react-native-checkbox-field';
// import type { Task } from '../types/index'
import Task from '../state/models/task'

// import { editTask, toggleTask } from '../state/actions/task'

export type Prop = {
  isHeader: bool,
  task: Task,
  onTextChange: (task: Task, text: string) => void,
  onToggleCheckbox: (task: Task) => void,
}

const EditTask = ({isHeader, task, onTextChange, onToggleCheckbox}) => {
      return (
        
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
    },
    checkboxView: {
      alignSelf: 'center',
    },
    checkboxStyle: {
        width: 26,
        height: 26,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    text_input: {
      flex: 1,
      height: 40,
    }
});

export default EditTask;
