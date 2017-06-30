import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

// TODO: move client ids to a configuration file
GoogleSignin.configure({
   scopes: ["https://www.googleapis.com/auth/calendar"], // what API you want to access on behalf of the user, default is email and profile
   iosClientId: "245808737532-gpqc29f2ifmvqprmetmmtr60gaoq0cfg.apps.googleusercontent.com", // only for iOS
   webClientId: "245808737532-ch1af9npbnnrova04gi752au3j74agia.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
   offlineAccess: true // if you want to access Google API on behalf of the user FROM YOUR SERVER
})

export const loginToGoogle = () =>
  GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
    console.log('signing in');
    return GoogleSignin.signIn().then(user => {
      console.log(user);
      // Log out from this account to allow subsequent logins.
      GoogleSignin.signOut();
      return user
    })
  })
