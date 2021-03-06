// import {API} from '../../network'
import {persistor} from '../../index'
import {Store} from '../../index'
import Meeting from '../models/meeting'
import User from '../models/user'
import { LoginManager } from 'react-native-fbsdk'
import {prepareDateForRequest} from '../../utils/DateTime'
import Suggestion from '../models/suggestion'
import {saveEvent, removeEvent} from '../../utils/Calendar';
import turf from 'turf'
import {TEST_MEETINGS} from '../../scenes/CalendarScene'
import {IS_IOS, IS_TEST_MEETINGS} from '../../settings';
import {NativeModules} from 'react-native';

export const NEW_ACCESS_TOKEN = "NEW_ACCESS_TOKEN"
export const FINISH_INTRO = "FINISH_INTRO"
export const PERMISSIONS_SWITCH_ON = "PERMISSIONS_SWITCH_ON"
export const PERMISSIONS_SWITCH_OFF = "PERMISSIONS_SWITCH_OFF"
export const NEW_LOCATION = "NEW_LOCATION"
export const LOG_OUT = "LOG_OUT"
export const ADD_EVENT_CALENDAR = "ADD_EVENT_CALENDAR"
export const REMOVE_EVENT_CALENDAR = "REMOVE_EVENT_CALENDAR"
export const NEW_SUGGESTIONS = "NEW_SUGGESTIONS"
export const SUGGESTIONS_LOADING = "SUGGESTIONS_LOADING"
export const NEW_CALENDAR = "NEW_CALENDAR"
export const NEW_CONTACTS = "NEW_CONTACTS"
export const REMOVE_SUGGESTION = "REMOVE_SUGGESTION"
export const INTRO_SUGGESTIONS_SEEN = "INTRO_SUGGESTIONS_SEEN"
export const INTRO_CALENDAR_SEEN = "INTRO_CALENDAR_SEEN"
export const NEW_PHONE_NUMBER = "NEW_PHONE_NUMBER"
export const SET_CALENDAR_BADGES = "SET_CALENDAR_BADGES"
export const CALENDAR_LOADING = "CALENDAR_LOADING"
export const MIGRATE_IOS_CALENDAR = "MIGRATE_IOS_CALENDAR"
export const SHOW_ACCEPTED_BANNER = "SHOW_ACCEPTED_BANNER"
export const DID_FINISH_CALENDAR_INTRO = "DID_FINISH_CALENDAR_INTRO"
export const STORE_DEVICE_EVENTS = "STORE_DEVICE_EVENTS"
export const SOCIAL_MEDIA_FB = 'Facebook'
export const MIGRATED_IOS_DATA = "MIGRATED_IOS_DATA"
export const LOAD_FRIENDS = "LOAD_FRIENDS"

export const newAccessToken = (accessToken) => {
  return {
    type: NEW_ACCESS_TOKEN,
    accessToken
  }
}
export const finishIntro = () => {
  return {
    type: FINISH_INTRO,
  }
}
export const switchPermissionsOn = () => {
  return {
    type: PERMISSIONS_SWITCH_ON,
  }
}
export const setFriends = (friends) => {
  return {
    type: LOAD_FRIENDS,
    friends
  }
}

export const switchPermissionsOff = () => {
  return {
    type: PERMISSIONS_SWITCH_OFF,
  }
}
export const addEventCalendar = (meetingIdEventIdMap) => {
  return {
    type: ADD_EVENT_CALENDAR,
    meetingIdEventIdMap
  }
}

export const removeEventCalendar = (meetingId) => {
  return {
    type: REMOVE_EVENT_CALENDAR,
    meetingId
  }
}
export const logOut = () => {
  LoginManager.logOut()
  return {
    type: LOG_OUT,
  }
}
export const newSuggestions = (suggestions) => {
  return {
    type: NEW_SUGGESTIONS,
    suggestions
  }
}
export const suggestionsLoading = (isLoading) => {
  return {
    type: SUGGESTIONS_LOADING,
    isLoading
  }
}
export const newCalendar = (upcomingMeetings, pastMeetings, badges) => {
  return {
    type: NEW_CALENDAR,
    upcomingMeetings,
    pastMeetings,
    badges
  }
}
export const calendarLoading = () => {
  return {
    type: CALENDAR_LOADING,
    isLoading: true
  }
}
export const newContacts = (numbers, emails) => {
  return {
    type: NEW_CONTACTS,
    numbers,
    emails,
  }
}
export const phoneVerified = () => {
  return {
    type: NEW_PHONE_NUMBER,
  }
}

export const removeSuggestion = (suggestion) => {
  return {
    type: REMOVE_SUGGESTION,
    suggestion
  }
}
export const setCalendarBadges = (badges) => {
  return {
    type: SET_CALENDAR_BADGES,
    badges
  }
}
export const introSuggestionsSeen = () => {
  return {
    type: INTRO_SUGGESTIONS_SEEN
  }
}
export const introCalendarSeen = () => {
  return {
    type: INTRO_CALENDAR_SEEN,
  }
}
export const newLocation = (lon, lat, timestamp) => {
  const metroId = getOpenTabelMetroId(lat, lon)
  return {
    type: NEW_LOCATION,
    lon,
    lat,
    timestamp,
    metroId
  }
}
export const migrateIOSCalendar = (iosCalendarMap) => {
  return {
    type: MIGRATE_IOS_CALENDAR,
    iosCalendarMap,
  }
}
export const showAcceptedBanner = (shouldShow) => {
  return {
    type: SHOW_ACCEPTED_BANNER,
    shouldShow
  }
}
export const finishCalendarIntro = () => {
  return {
    type: DID_FINISH_CALENDAR_INTRO,
  }
}
export const migratedIOSData = () => {
  return {
    type: MIGRATED_IOS_DATA,
  }
}

export const sendLocation = (lon, lat, timestamp) => {
  return (dispatch, getState, getAPI) => getAPI(getState, dispatch).sendLocation(lon, lat, timestamp)
  }

  // Requires a channel type which can be one of these: “sms”, “email”, “fb-messenger”, “fb-share”, “twitter”.
  // “person”


  export const logShare = (type, person) => (dispatch, getState, getAPI) => getAPI(getState, dispatch).growthLog(type, person)

export const loadUserSuggestions = (userId) => {
  return (dispatch, getState, getAPI) => getAPI(getState, dispatch).suggestionsWithUser(userId)

  }



export const loadFriends = () =>
  (dispatch, getState, getAPI) => getAPI(getState, dispatch).getFriends().then((data) => {
    console.log(data)
    dispatch(setFriends(data.map((item) => new User(item))))
  })

export const sendPhoneNumber = (phoneNumber, token) =>
  (dispatch, getState, getAPI) => getAPI(getState, dispatch).sendPhoneNumber(phoneNumber, token)


export const loadScheduledMeetings = () => {
  return (dispatch, getState, getAPI) => getAPI(getState, dispatch).getConfirmedMeetings().then((data) => {
    if (IS_TEST_MEETINGS) {
      data = TEST_MEETINGS
    }
    console.log(data)
    console.log('loadScheduledMeetings0')
    if (data.error) {
      return
    }
    const badges = data.badges
    const meetings = data.data.map((meeting) => new Meeting(meeting))
    console.log('loadScheduledMeetings1')

    console.log('loadScheduledMeetings2')

    data = meetings.filter((meeting) => meeting.canceled == 0)
    const pastMeetings = data.filter((meeting) => meeting.isPast())
    pastMeetings.sort(function(a,b) {return (a.meeting_time < b.meeting_time)? 1 : ((a.meeting_time > b.meeting_time) ? -1 : 0);} );
    const upcomingMeetings = data.filter((meeting) => !meeting.isPast())
    upcomingMeetings.sort((a,b) => (a.meeting_time > b.meeting_time)? 1 : ((a.meeting_time < b.meeting_time) ? -1 : 0) );

    // this.setState({upcomingMeetings, pastMeetings})
    console.log('loadScheduledMeetings3')
    dispatch(newCalendar(upcomingMeetings, pastMeetings, badges))
  })
}

const _updateDeviceCalendar = (dispatch, meetings) => {
  let calendarMap = Store.getState().app.calendarMap
  meetings.forEach((meeting) => {
    if (meeting.suggestion_id in calendarMap) {
      if (meeting.canceled == 1) {
        removeEvent(calendarMap[meeting.suggestion_id]).then((success) => dispatch(removeEventCalendar(meeting.suggestion_id)))
      }
    } else if (meeting.canceled == 0) {
      const end_time = meeting.meeting_time.clone().add(meeting.getDuration(), 'm');
      saveEvent(meeting.getTitle(), meeting.meeting_time, end_time).then((id) => {
        dispatch(addEventCalendar({[meeting.suggestion_id]: id}))
      })
    }
  });
}

export const loadSuggestions = () => {
  return (dispatch, getState, getAPI) => {
      dispatch(suggestionsLoading(true));
      getAPI(getState, dispatch).suggestions().then((data) => {
          console.log(data)
          suggestions = data.map((item) => {return new Suggestion(item)})
          dispatch(newSuggestions(suggestions))
      }).catch((error) => {
          console.error(error);
          dispatch(suggestionsLoading(false));
      });
    }
  }

export const storeDeviceEvents = (events) => {
  return {
    type: STORE_DEVICE_EVENTS,
    events,
  }
}

export const sendEvents = (events) => {
  events = events.map((event) => {
    return {
      "begin": prepareDateForRequest(event.startDate),
      "end": prepareDateForRequest(event.endDate)
  }})

  console.log(events)

  return (dispatch, getState, getAPI) => getAPI(getState, dispatch).sendEvents(events)
  }

export const acceptSuggestion = (suggestion, times, message) => {
  return (dispatch, getState, getAPI) =>
      getAPI(getState, dispatch).accept(suggestion.id, times, message)
  }

  export const resetBadges = () => {
    return (dispatch, getState, getAPI) =>
        getAPI(getState, dispatch).resetCalendarBadge()
    }
export const cancelMeeting = (meeting) => {
  return (dispatch, getState, getAPI) =>
      getAPI(getState, dispatch).cancel(meeting.suggestion_id)
  }

export const sendGoogleAuthToken = (serverAuthToken) => {
  return (dispatch, getState, getAPI) =>
      getAPI(getState, dispatch).sendGoogleAccessToken(serverAuthToken)
  }

export const loadCalendarAccounts = () =>
  (dispatch, getState, getAPI) => getAPI(getState, dispatch).getCalendarAccounts()

export const editCalendar = (calendar_id, enabled, is_default) => {
  console.log(enabled);
  return (dispatch, getState, getAPI) => getAPI(getState, dispatch).editCalendar(calendar_id, enabled, is_default)
}
export const rejectSuggestion = (suggestion, responseType) => {
  return (dispatch, getState, getAPI) =>
      getAPI(getState, dispatch).reject(suggestion.id, responseType).then((data) => {
        dispatch(removeSuggestion(suggestion))
  })
  }

export const sendSocialMediaAccessToken = (accessToken, type) => {
    if (type == SOCIAL_MEDIA_FB) {
      return (dispatch, getState, getAPI) => {
        console.log(getState)
        // console.log(API)
        getAPI(getState, dispatch).loadUser(accessToken)
        .then((data) => {
          console.log('json received')
          dispatch(newAccessToken(data.auth_token))
          // persistor.rehydrate({some: 'hello'})
      })
        .catch((error) => {
          console.error(error);
        });
      };
    }
}

const getPoint = (lat, lng) => {
  return {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [lat, lng]
    }
  }
}

const OPENTABLE_METRO_IDS = [
  {
    location: {
      lat: 42.36,
      lng: -71.05
    },
    metroId: 7
  },
  {
    location: {
      lat: 37.56,
      lng: -122.32
    },
    metroId: 4
  },
  {
    location: {
      lat: 40.71,
      lng: -74.00
    },
    metroId: 8
  },
  {
    location: {
      lat: 41.87,
      lng: -87.62
    },
    metroId: 3
  },
  {
    location: {
      lat: 47.60,
      lng: -122.33
    },
    metroId: 2
  },
  {
    location: {
      lat: 34.05,
      lng: -118.24
    },
    metroId: 6
  },
  {
    location: {
      lat: 26.12,
      lng: -80.13
    },
    metroId: 17
  },
  {
    location: {
      lat: 43.65,
      lng: -79.38
    },
    metroId: 74
  },
  {
    location: {
      lat: 45.50,
      lng: -73.56
    },
    metroId: 75
  },
]

const getOpenTabelMetroId = (lat, lng) => {
  const currentPos = getPoint(lat, lng)
  const units = "miles"
  const RANGE = 100

  for (let item of OPENTABLE_METRO_IDS) {
    if (turf.distance(currentPos, getPoint(item.location.lat, item.location.lng), units) < RANGE) {
      return item.metroId
    }
  }
  return null
}
