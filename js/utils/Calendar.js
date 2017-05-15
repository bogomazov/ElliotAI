import RNCalendarEvents from 'react-native-calendar-events';
import {fromDateToIsoStr} from './DateTime'

export const getEvents = (momentStart, momentEnd) =>
  RNCalendarEvents.fetchAllEvents(momentStart.toISOString(), momentEnd.toISOString())
//   RNCalendarEvents.findCalendars()
//       .then(calendars => {
//         console.log(calendars)
//         calendars = calendars.filter((calendar) => calendar.allowsModifications)
//         calendarIds = calendars.map(i => i.id);
//         console.log(momentStart)
//         console.log()
//         console.log(fromDateToIsoStr(momentStart.toDate()))
//         startDateStr = (fromDateToIsoStr(momentStart.toDate())).replace("Z", ".000Z")
//         endDateStr = (fromDateToIsoStr(momentEnd.toDate())).replace("Z", ".000Z")
//         return RNCalendarEvents.fetchAllEvents(momentStart.toISOString(), momentEnd.toISOString(), calendarIds)
          
//         // handle calendars
//       })

