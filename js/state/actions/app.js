// import {API} from '../../network'
import {persistor} from '../../index'
export const NEW_ACCESS_TOKEN = "NEW_ACCESS_TOKEN"
export const FINISH_INTRO = "FINISH_INTRO"
export const PERMISSIONS_SWITCH = "PERMISSIONS_SWITCH"
export const NEW_LOCATION = "NEW_LOCATION"
export const LOG_OUT = "LOG_OUT"

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
export const switchPermissions = () => {
  return {
    type: PERMISSIONS_SWITCH,
  }
}
export const logOut = () => {
  return {
    type: LOG_OUT,
  }
}


// export const saveState = () => {
//   return {
//     type: REHYDRATE
//   }
// }


export const sendSocialMediaAccessToken = (accessToken, type) => {
    if (type == SOCIAL_MEDIA_FB) {
      return (dispatch, getState, getAPI) => {
        console.log(getState)
        // console.log(API)

        getAPI(getState).loadUser(accessToken)
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
