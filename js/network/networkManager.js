import {Store} from '../index'
import { logOut } from '../state/reducers/app'

const rootURL = 'https://staging.elliot.ai/control'

class API {
  constructor(accessToken, dispatch) {
    this.accessToken = accessToken;
    this.dispatch = dispatch;
  }

  loadUser = (accessToken) => this.post('/load_user', {'fb_auth_token': accessToken})
  sendLocation = (lon, lat, timestamp) =>
    this.post('/location', {
      'longitude': lon,
      'latitude': lat,
      'time_zone': new Date().getTimezoneOffset(),
  })


  // "begin": "2010-01-15 17:25:49", // Date and times in this format:
  // "end": "2010-01-15 19:30:00"    // "yyyy-MM-dd HH:mm:ss"
  sendEvents = (events) =>
    this.post('/calendar_events', {'data': events})

  reject = (suggestionId, responseType) =>
    this.post('/reject', {
      "suggestion_id" : suggestionId,
      "response_type" : responseType
    })
  accept = (suggestionId, times) =>
    this.post('/accept', {
      "suggestion_id" : suggestionId,
      "times" : times
    })
  cancel = (suggestionId) =>
    this.post('/cancel', {
      "suggestion_id" : suggestionId
    })
  sendPhoneNumber = (phoneNumber, token) =>
    this.post('/sms_number', {
      "sms_number" : phoneNumber,
      "sms_token" : token,
    })
// Requires a channel type which can be one of these: “sms”, “email”, “fb-messenger”, “fb-share”, “twitter”.
// “person”

  growthLog = (channel, person) =>
    this.post('/growth_log', {
      "channel" : channel,
      "person" : person,
    })

    getConfirmedMeetings = () =>
        this.get('/scheduled')
    getFriends = () =>
        this.get('/friends')
    suggestions = () =>
        this.get('/suggestions')
    suggestionsWithUser = (userId) =>
        this.get('/suggestions?friend=' + userId)


  post = (path, data) => {
    console.log(path)
    console.log(data)
    console.log(JSON.stringify(data))
    return fetch(rootURL + path, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Android',
        'auth-token': this.accessToken
      },
      body: JSON.stringify(data)
    }).then((response) => {
      console.log(response)
        if (response.status == 401) {
          dispatch(logOut())
        }
        return response.json()
      }).catch((error) => {
      console.log(error)
    })
  }

  get = (path) => {
    console.log(path)
    return fetch(rootURL + path, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'auth-token': this.accessToken
      }
    }).then((response) => {
      console.log(response)
        if (response.status == 401) {
          dispatch(logOut())
        }
        return response.json()
      })
  }
}

export const getAPI = (getState, dispatch) => {
  const state = getState()
  console.log(state)
  return new API(state.app.accessToken, dispatch)
}
