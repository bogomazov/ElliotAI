import {Store} from '../index'
import * as appActions from '../state/actions/app';
import { bindActionCreators } from 'redux'
import DeviceInfo from 'react-native-device-info'
import { IS_DEV, APP_VERSION } from '../settings'

const subdomain = (!IS_DEV) ? 'prod' : 'staging'

const rootURL = `https://${subdomain}.elliot.ai/control`

const USER_AGENT = DeviceInfo.getUserAgent()
// console.log(userAgent)


class API {
  constructor(accessToken, dispatch) {
    this.accessToken = accessToken;
    this.appActions = bindActionCreators(appActions, dispatch);
  }

  loadUser = (accessToken) => this.post('/load_user', {'fb_auth_token': accessToken})
  sendLocation = (lon, lat, timestamp) =>
    this.post('/location', {
      'longitude': lon,
      'latitude': lat,
      'time_zone': (new Date().getTimezoneOffset())*(-60),
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
  sendGoogleAccessToken = (google_access_token) =>
    this.post('/reject', {
      google_access_token
    })
  editCalendar = (calendar_id, enable, is_default) =>
    this.post(`/calendar/${calendar_id}`, {
      enable,
      "default": is_default
    })
  getCalendarAccounts = () => this.get('/calendar_accounts')

  accept = (suggestionId, times, message) =>
    this.post('/accept', {
      "suggestion_id" : suggestionId,
      "times" : times,
      "message": message || null
    })
  cancel = (suggestionId) =>
    this.post('/cancel', {
      "suggestion_id" : suggestionId
    })
  resetCalendarBadge = () =>
    this.post('/badge_reset')
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

  headers = () => {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': `Elliot / ${APP_VERSION} ` + USER_AGENT,
      'auth-token': this.accessToken
  }}

  post = (path, data) => {
    console.log(path)
    console.log(data)
    console.log(this.headers())
    console.log(JSON.stringify(data))
    return fetch(rootURL + path, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(data)
    }).then((response) => {
      console.log(response)
        if (response.status == 401) {
          this.appActions.logOut()
        }
        return response.json()
    }).catch((error) => {
      console.log(error);
      throw error;
    })
  }

  get = (path) => {
    console.log(path)
    return fetch(rootURL + path, {
      method: 'GET',
      headers: this.headers()
    }).then((response) => {
      console.log(response)
        if (response.status == 401) {
          this.appActions.logOut()
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
