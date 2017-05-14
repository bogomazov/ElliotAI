import Immutable, {Map, OrderedMap}  from 'immutable'
// import User from './user'

TYPE_CALL = "Call"
TYPE_LUNCH = "Lunch"
TYPE_COFFEE = "Coffee"
TYPE_DINNER = "Dinner"

export const getMeetingTypeIcon = (meeting_type) => {
  switch(meeting_type) {
    case TYPE_CALL:
      return require('../../res/images/call-66px.png')
    case TYPE_LUNCH:
      return require('../../res/images/lunch-66px.png')
    case TYPE_COFFEE:
      return require('../../res/images/coffee-66px.png')
    case TYPE_DINNER:
      return require('../../res/images/dinner-66px.png')
  }
}

const MeetingRecord = Immutable.Record({
  canceled: undefined,
  meeting_time: undefined,
  friend: undefined,
  meeting_type: undefined
}, 'SuggestionRecord')

class Meeting extends MeetingRecord {
  
}

export default Meeting
