import * as actionType from '../actions/app'
import { REHYDRATE } from 'redux-persist/constants'

const defaultState = {
  accessToken: null,
  isLoggedIn: false,
  isPermissionsGranted: false,
  isLocationGiven: false,
  location: {lat: 0.0, lng: 0.0, updatedAt: 0},
  isRehydrated: false,
  suggestions: [],
  isSuggestionsLoaded: false
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
          suggestions: [],
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
    case actionType.NEW_SUGGESTIONS:
      return {
        ...state,
        isSuggestionsLoaded: true,
        suggestions: action.suggestions
      }
    default:
      return state
  }
}

export default app
