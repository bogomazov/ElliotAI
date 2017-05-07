/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Button, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appActions from '../state/actions/app';
import RNCalendarEvents from 'react-native-calendar-events';
import Contacts from 'react-native-contacts'
import strings from '../res/values/strings'


const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
		// projectActions: bindActionCreators(projectActions, dispatch),
	}
}

export const checkContactPermission = new Promise((resolve, reject) => {
  Contacts.checkPermission( (err, permission) => {
    // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
    // if(permission === 'undefined'){
    //   Contacts.requestPermission( (err, permission) => {
    //     // ...
    //   })
    // }
    if(permission === 'authorized'){
      resolve('authorized')
    } else {
      reject('no contact permission')
    }
    // if(permission === 'denied'){
    //   // x.x
    // }
  })
})

@connect(mapStateToProps, mapDispatchToProps)
export default class PermissionsScene extends Component {

  onPressNext = () => {
    this.props.appActions.finishIntro()
  }

  componentDidMount = () => {
		Contacts.getAll((err, contacts) => {
			console.log(err)
		  if(err === 'denied'){
		    // x.x
        console.log('Contacts denied')

		  } else {
        console.log('Contacts')

		    console.log(contacts)
		  }
		})

		RNCalendarEvents.authorizeEventStore().then(status => {
			RNCalendarEvents.fetchAllEvents('2016-08-19T19:26:00.000Z', '2017-08-19T19:26:00.000Z')
			  .then(events => {
			    // handle events

					console.log('Calendar fetchAllEvents')
					console.log(events)
			  })
			  .catch(error => {
          console.log(error)

			   // handle error
			  });
	  })
	  .catch(error => {
	   // handle error
	  });
		RNCalendarEvents.authorizationStatus()
		  .then(status => {
        console.log('Calendar authorizationStatus')

				console.log(status)
		    // handle status
		  })
		  .catch(error => {
				console.log(error)

		   // handle error
		  });


	}

  render() {
			return (<View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={styles.logoText}>Elliot</Text>
          <Text style={styles.description}> Elliot needs permissions</Text>
        </View>
        <View style={styles.middleWrapper}>
          <Button
            onPress={this.onPressNext}
            title="Enable Contacts"
            color="#817550"
            style={{flex: 3}}
          />

        </View>
        <Text style={styles.description}>{strings.disclaimer}</Text>

      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#817550',
    padding: 25
  },
  topWrapper: {
    flexDirection: 'column',
  },
  logoText: {
    color: '#fff',
    fontSize: 46,
    // flex: 1,
  },
  description: {
    color: '#fff',
  },
  middleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 200
    // flex: 1,
  }
});
