import {NEW_ACCESS_TOKEN, FINISH_INTRO, NEW_LOCATION, LOG_OUT, PERMISSIONS_SWITCH_OFF, PERMISSIONS_SWITCH_ON} from '../actions/app'
import { REHYDRATE } from 'redux-persist/constants'

const defaultState = {
  accessToken: null,
  isLoggedIn: false,
  isPermissionsGranted: false,
  isLocationGiven: false,
  location: {lat: 0.0, lng: 0.0, updatedAt: 0},
  isRehydrated: false
}

const app = (state = defaultState, action) => {
  switch (action.type) {
    // case 'ADD_TODO':
    //   return {
    //     id: action.id,
    //     text: action.text,
    //     completed: false
    //   }
    case NEW_ACCESS_TOKEN:
      // console.log('NEW_ACCESS_TOKEN')
      return {
        ...state,
        accessToken: action.accessToken,
        isLoggedIn: true
      }
    case FINISH_INTRO:
      return {
        ...state,
        isSeenIntro: true
      }
    case REHYDRATE:
      const incoming = action.payload.app
      return {...state, ...incoming,
          isRehydrated: true,
          isLocationGiven: false,
        }
    case NEW_LOCATION:
      return {
        ...state,
        isLocationGiven: true,
        location: {lat: action.lat, lng: action.lng, updatedAt: action.updatedAt},
      }
    case LOG_OUT:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
        isPermissionsGranted: false
      }
    case PERMISSIONS_SWITCH_ON:
      return {
        ...state,
        isPermissionsGranted: true
      }
    case PERMISSIONS_SWITCH_OFF:
      return {
        ...state,
        isPermissionsGranted: false
      }
    default:
      return state
  }
}

export default app
