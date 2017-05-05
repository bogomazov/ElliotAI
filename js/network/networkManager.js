import {Store} from '../index'

const rootURL = 'https://staging.elliot.ai/control'

class API {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  loadUser = (accessToken) =>
    this.post('/load_user', {'fb_auth_token': accessToken})


  post = (path, data) => {
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
      })
  }
}

export const getAPI = (getState) => {
  const state = getState()
  console.log(state)
  return new API(state.app.accessToken)
}
