import LocalizedStrings from 'react-native-localization';

// Use for formating:
// en:{
//     bread:"bread",
//     butter:"butter",
//     question:"I'd like {0} and {1}, or just {0}"
//   }
// strings.c(strings.question, strings.bread, strings.butter)


export default strings = new LocalizedStrings({
 en:{
   login1: "Elliot suggests people and time for you to meet",
   login2:"As you plan your week, let Elliot know what works for you",
   login3:"If you and your friend can both meet, Elliot schedules",
   enableLocation:"Enable Location",
   enableContacts:"Enable Contacts",
   enableCalendar:"Enable Calendar",
   tellFriendsTop: "Invite Friends to Elliot",
   tellFriends: "Invite",
   tellMoreFriends: "Invite your friends to Elliot to start planning!",
   disclaimer: "This information will not be shared with anyone.",
   introSuggestions: "Elliot suggests people and times for you to meet here. Tap 'More Options' on a suggestion to find another time to meet.",
   introCalendar: "When you and your friends respond to suggestions, Elliot will confirm times to meet here.",
   inviteDirected: "Hey {0}, let's catch up soon! I am using this new app called Elliot to stay in touch with friends. http://elliot.ai",
   inviteDirectedSMS: "Hey, let's catch up soon! I am using this new app called Elliot to stay in touch with friends. http://elliot.ai",
   inviteMessenger: "Let's catch up soon! I am using this new app called Elliot to stay in touch with friends, check it out.",
   inviteFacebook: "Try out Elliot, a new app to meet with friends!",
   inviteTwitter: "Try out Elliot, a new app to meet with friends!",
   phoneIntro: "We need your phone number to let you know of meetings with friends.",
   phoneDisclaimer: "This information will not be shared with anyone."
 }
});

export const format = (str, ...args) => strings.formatString(str, ...args)
