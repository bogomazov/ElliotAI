/**
 * Created by andrey on 10/18/16.
 @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Image, Button, View, StyleSheet, Text, TouchableHighlight, Navigator, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import IntroSwipe from '../containers/Intro'
import * as appActions from '../state/actions/app';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import LocationAccess from '../modules/LocationAccessModule'
import RNCalendarEvents from 'react-native-calendar-events';
import Contacts from 'react-native-contacts'
import { fromDateToIsoStr } from '../utils/DateTime'

const mapStateToProps = (state) => {
	return {app: state.app}
}

const mapDispatchToProps = (dispatch) => {
	return {
		appActions: bindActionCreators(appActions, dispatch),
	}
}



@connect(mapStateToProps, mapDispatchToProps)
export default class SplashScene extends Component {
  updateData = () => {
    console.log('did mount')
    console.log(this.props.app.isRehydrated)
    console.log(this.props.app.isLoggedIn)


      console.log('checkLocationServicesIsEnabled')
      LocationAccess.checkLocationAccess().then((response) => {
        console.log(response)
        if (response == 'success') {
          this.requestCurrentLocation()
        }
      }).catch((error) => {
        console.log(error)
      })

      Contacts.getAll((err, contacts) => {
  			console.log(err)
  		  if(err === 'denied'){
  		    // x.x
          console.log('Contacts denied')

          this.props.appActions.switchPermissionsOff()
  		  } else {
          console.log('Contacts')

  		    console.log(contacts)
  		  }
  		})

      RNCalendarEvents.findCalendars()
      .then(calendars => {
        console.log(calendars)
        calendars = calendars.filter((calendar) => calendar.allowsModifications)
        calendarIds = calendars.map(i => i.id);

        endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)
        startDate = new Date()
        
        startDateStr = (fromDateToIsoStr(startDate)).replace("Z", ".000Z")
        endDateStr = (fromDateToIsoStr(endDate)).replace("Z", ".000Z")
        RNCalendarEvents.fetchAllEvents(startDateStr, endDateStr, calendarIds)
          .then(events => {
            // handle events

            console.log('Calendar fetchAllEvents')
            console.log(events)
            if (events.length > 0) {
              this.props.appActions.sendEvents(events)
            }
          })
          .catch(error => {
            console.log(error)

           // handle error
          });
        // handle calendars
      })
      .catch(error => {
        // handle error
        console.log(error)
        this.props.appActions.switchPermissionsOff()
      });

  		// RNCalendarEvents.authorizeEventStore().then(status => {
        
    //     console.log(startDateStr)
    //     // RNCalendarEvents.fetchAllEvents(fromDateToStr(startDate), fromDateToStr(endDate), ['4', '7'])
  			
  	 //  })
  	 //  .catch(error => {
    //     console.log(error)

  	 //   // handle error
  	 //  });
  }

  requestCurrentLocation = () => {
		console.log('request Location')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        var initialPosition = JSON.stringify(position);
				console.log(initialPosition)

        // this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 3000, maximumAge: 25000}
    );
	}

  render() {
      if (this.props.app.isRehydrated && this.props.app.isLoggedIn) {

        this.updateData()
      }
			return (<View style={styles.container}>
        <Image
          style={{width: 100, height: 100}}
          source={require('../res/images/Icon-40@3x.png')}/>
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
