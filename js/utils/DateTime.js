import dateFormat from 'dateformat'
import moment from 'moment'

export const fromDateToIsoStr = (date) => {
  // 2016-08-19T19:26:00.000Z
  return dateFormat(date, "isoUtcDateTime");
}

export const prepareDateForRequest = (dateStr) => {
  return moment(dateStr).local().format("YYYY-MM-DD HH:mm:ss")
}

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export const getDay = (date) => days[ date.getDay() ];
export const getMonth = (date) => months[ date.getMonth() ];
