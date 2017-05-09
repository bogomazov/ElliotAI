import dateFormat from 'dateformat'

export const fromDateToIsoStr = (date) => {
  // 2016-08-19T19:26:00.000Z
  return dateFormat(date, "isoUtcDateTime");
}

export const prepareDateForRequest = (dateStr) => {
	return dateStr.replace(".000Z", "").replace("T", " ")
}