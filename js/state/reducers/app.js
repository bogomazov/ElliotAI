import {NEW_ACCESS_TOKEN, FINISH_INTRO} from '../actions/app'
// import { REHYDRATE } from 'redux-persist/constants'

const defaultState = {
  accessToken: null,
  isLoggedIn: false,
  isSeenIntro: false
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
    default:
      return state
  }
}

export default app
