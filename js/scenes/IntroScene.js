/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Button, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import IntroSwipe from '../containers/Intro'
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
export default class IntroScene extends Component {

  onPressNext = () => {
    this.props.appActions.finishIntro()
  }

  render() {
			return (<View style={styles.container}>
				<IntroSwipe style={styles.swiper}/>
        <View style={styles.button}>
        <Button
          onPress={this.onPressNext}
          title="Next"
          color="#841584"
          style={{flex: 3}}
        />
        </View>
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  swiper: {
    // flex: 1,
  },
  button: {
    height: 200
    // flex: 1,
  }
});
