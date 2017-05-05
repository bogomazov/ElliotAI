/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LoginScene from './LoginScene'
import * as appActions from '../state/actions/app';


const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),

		// projectActions: bindActionCreators(projectActions, dispatch),
	}
}

@connect(mapStateToProps, mapDispatchToProps)
export default class MainScene extends Component {
  render() {
		console.log(this.props)
		// this.props.appActions.newAccessToken('new one')

			if (!this.props.app.isLoggedIn) {
				return <LoginScene/>
			}

			return (<View style={styles.container}>
				<Text>Hello1</Text>
      </View>);

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  bottom_bar: {
    // width: 100%,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: 'gray',
    borderWidth: 1
  },
  input: {
    borderBottomColor: '#bbb',
    borderBottomWidth: 2,
    margin: 10
  },
	modal: {
		width: 50,
	}
});
