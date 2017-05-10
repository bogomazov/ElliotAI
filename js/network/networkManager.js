import {Store} from '../index'

const rootURL = 'https://staging.elliot.ai/control'

class API {
  constructor(accessToken) {
    this.accessToken = accessToken;
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
  cancel = (suggestionId, times) =>
    this.post('/cancel', {
      "suggestion_id" : suggestionId
    })



// Requires a channel type which can be one of these: “sms”, “email”, “fb-messenger”, “fb-share”, “twitter”.
// “person”

  growthLog = (channel, person) =>
    this.post('/growth_log', {
      "channel" : channel,
      "person" : person,
    })

  //   {
  //     "data": [
  //         {
  //           "canceled" : 1,
  //           "meeting_time" : "2017-03-17 22:30:00",
  //           "suggestion_id" : 3242, // suggestion id of this confirmed meeting
  //           "friend" : {
  //             "last_name" : "Alaefchgghcfe Riceson",
  //             "image" : "Image URL", // friend's facebook profile image url
  //             "first_name" : "Linda",
  //             "fb_id" : "Facebook ID" // friend's facebook id
  //           },
  //           "meeting_type" : "Call"
  //         }
  //         ...
  //     ],
  // }
    getConfirmedMeetings = () =>
        this.get('/scheduled')
    suggestions = () =>
        this.get('/suggestions')
    suggestionsWithUser = (userId) =>
        this.get('/suggestions?friend=${userId}')


  post = (path, data) => {
    console.log(path)
    console.log(data)
    console.log(JSON.stringify(data))
    return fetch(rootURL + path, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'auth-token': this.accessToken
      },
      body: JSON.stringify(data)
    }).then((response) => {
      console.log(response)
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
        return response.json()
      })
  }
}

export const getAPI = (getState) => {
  const state = getState()
  console.log(state)
  return new API(state.app.accessToken)
}
