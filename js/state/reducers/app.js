import * as actionType from '../actions/app'
import { REHYDRATE } from 'redux-persist/constants'

const defaultState = {
  accessToken: null,
  isLoggedIn: false,
  isPermissionsGranted: false,
  isLocationGiven: false,
  isPhoneNumberVerified: false,
  location: {lat: 0.0, lng: 0.0, updatedAt: 0},
  isRehydrated: false,
  suggestions: [],
  upcomingMeetings: [],
  pastMeetings: [],
  emails: [],
  numbers: [],
  calendarMap: {},
  calendarBadges: 0,
  isSuggestionsLoaded: false,
  isIntroSuggestionsSeen: false,
  isIntroCalendarSeen: false,
  isCalendarLoaded: false,
  isCalendarLoading: false,
  isContactsLoaded: false,
}

const app = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.NEW_ACCESS_TOKEN:
      // console.log('NEW_ACCESS_TOKEN')
      return {
        ...state,
        accessToken: action.accessToken,
        isLoggedIn: true
      }
    case actionType.FINISH_INTRO:
      return {
        ...state,
        isSeenIntro: true
      }
    case REHYDRATE:
      const incoming = action.payload.app
      console.log(incoming)
      return {...state, ...incoming,
          isRehydrated: true,
          isLocationGiven: false,
          isSuggestionsLoaded: false,
          isCalendarLoaded: false,
          isCalendarLoading: false,
          suggestions: [],
          upcomingMeetings: [],
          pastMeetings: [],
        }
    case actionType.NEW_LOCATION:
      return {
        ...state,
        isLocationGiven: true,
        location: {lat: action.lat, lng: action.lng, updatedAt: action.updatedAt},
      }
    case actionType.LOG_OUT:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
        isPermissionsGranted: false
      }
    case actionType.PERMISSIONS_SWITCH_ON:
      return {
        ...state,
        isPermissionsGranted: true
      }
    case actionType.PERMISSIONS_SWITCH_OFF:
      return {
        ...state,
        isPermissionsGranted: false
      }
    case actionType.ADD_EVENT_CALENDAR:
      return {
        ...state,
        calendarMap: {...state.calendarMap, ...action.meetingIdEventIdMap}
      }
    case actionType.REMOVE_EVENT_CALENDAR:
        delete state.calendarMap[action.meetingId]
        return {
          ...state
        }
    case actionType.NEW_SUGGESTIONS:
      return {
        ...state,
        isSuggestionsLoaded: true,
        suggestions: action.suggestions
      }
      case actionType.NEW_CALENDAR:
        return {
          ...state,
          isCalendarLoaded: true,
          upcomingMeetings: action.upcomingMeetings,
          pastMeetings: action.pastMeetings,
          calendarBadges: action.badges,
          isCalendarLoading: false
        }
      case actionType.CALENDAR_LOADING:
        return {
          ...state,
          isCalendarLoading: action.isLoading
        }
      case actionType.SET_CALENDAR_BADGES:
       return {
         ...state,
         calendarBadges: action.badges
       }
      case actionType.NEW_CONTACTS:
        return {
          ...state,
          isContactsLoaded: true,
          numbers: action.numbers,
          emails: action.emails,
        }
    case actionType.INTRO_SUGGESTIONS_SEEN:
      return {
        ...state,
        isIntroSuggestionsSeen: true,
      }
    case actionType.NEW_PHONE_NUMBER:
      return {
        ...state,
        isPhoneNumberVerified: true,
      }
    case actionType.INTRO_CALENDAR_SEEN:
      return {
        ...state,
        isIntroCalendarSeen: true,
      }
    case actionType.REMOVE_SUGGESTION:
//         console.log(action.suggestion.filter((item) => item.id != action.suggestion.id))
        return {
          ...state,
          suggestions: state.suggestions.filter((item) => item.id != action.suggestion.id)
        }
    default:
      return state
  }
}

export default app
