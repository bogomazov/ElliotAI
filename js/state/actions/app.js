// import {API} from '../../network'
import {persistor} from '../../index'
import {prepareDateForRequest} from '../../utils/DateTime'
import Suggestion from '../models/suggestion'

export const NEW_ACCESS_TOKEN = "NEW_ACCESS_TOKEN"
export const FINISH_INTRO = "FINISH_INTRO"
export const PERMISSIONS_SWITCH_ON = "PERMISSIONS_SWITCH_ON"
export const PERMISSIONS_SWITCH_OFF = "PERMISSIONS_SWITCH_OFF"
export const NEW_LOCATION = "NEW_LOCATION"
export const LOG_OUT = "LOG_OUT"
export const NEW_SUGGESTIONS = "NEW_SUGGESTIONS"
export const REMOVE_SUGGESTION = "REMOVE_SUGGESTION"

export const SOCIAL_MEDIA_FB = 'Facebook'

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

export const switchPermissionsOff = () => {
  return {
    type: PERMISSIONS_SWITCH_OFF,
  }
}
export const logOut = () => {
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

export const removeSuggestion = (suggestion) => {
  return {
    type: REMOVE_SUGGESTION,
    suggestion
  }
}
export const newLocation = (lon, lat, timestamp) => {
  return {
    type: NEW_LOCATION,
    lon: lon,
    lat: lat,
    timestamp: timestamp
  }
}

export const sendLocation = (lon, lat, timestamp) => {
  return (dispatch, getState, getAPI) => {
      getAPI(getState, dispatch).sendLocation(lon, lat, timestamp).then((data) => {
          dispatch(newLocation(lon, lat, timestamp))
      })
    }
  }

export const loadUserSuggestions = (userId) => {
  return (dispatch, getState, getAPI) => getAPI(getState, dispatch).suggestionsWithUser(userId)
    
  }

export const loadSuggestions = () => {
  return (dispatch, getState, getAPI) => {
      getAPI(getState, dispatch).suggestions().then((data) => {
          suggestions = data.map((item) => {return new Suggestion(item)})
          dispatch(newSuggestions(suggestions))
      }).catch((error) => {
          console.error(error);
        });
    }
  }

export const sendEvents = (events) => {
  events = events.map((event) => {
    return {
      "begin": prepareDateForRequest(event.startDate),
      "end": prepareDateForRequest(event.endDate)
  }})

  console.log(events)

  return (dispatch, getState, getAPI) => {
      getAPI(getState, dispatch).sendEvents(events).then((data) => {
          console.log(data)
      })
    }
  }

export const acceptSuggestion = (suggestion, times) => {
  return (dispatch, getState, getAPI) =>
      getAPI(getState, dispatch).accept(suggestion.id, times)
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

          // setTimeout(() => {
          //     // This function is able to dispatch other action creators
          //     dispatch(itemsHasErrored(true));
          // }, 5000);

      };
    }

    // We return a function instead of an action object

}
