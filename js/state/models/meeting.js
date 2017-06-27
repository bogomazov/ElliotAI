import Immutable, {Map, OrderedMap}  from 'immutable'
import User from './user'
import moment from 'moment'

// import User from './user'

TYPE_CALL = "Call"
TYPE_LUNCH = "Lunch"
TYPE_COFFEE = "Coffee"
TYPE_DINNER = "Dinner"
TYPE_TEA = "Tea"

export const getMeetingTypeIcon = (meeting_type) => {
  switch(meeting_type) {
    case TYPE_CALL:
      return require('../../res/images/call-66px.png')
    case TYPE_LUNCH:
      return require('../../res/images/lunch-66px.png')
    case TYPE_COFFEE:
      return require('../../res/images/coffee-66px.png')
    case TYPE_TEA:
      return require('../../res/images/coffee-66px.png')
    case TYPE_DINNER:
      return require('../../res/images/dinner-66px.png')
  }
}

const MeetingRecord = Immutable.Record({
  suggestion_id: undefined,
  canceled: undefined,
  meeting_time: undefined,
  friend: undefined,
  meeting_type: undefined
}, 'SuggestionRecord')

class Meeting extends MeetingRecord {
  constructor(args) {
    super({...args,
           friend: new User(args.friend),
           meeting_time: moment(args.meeting_time)})
          }

    getTitle = () => `${this.meeting_type} with ${this.friend.first_name} ${this.friend.last_name}`

    getDateStr = () => this.meeting_time.format('dddd, MMM D')

    isPast = () => moment() > this.meeting_time

    isCall = () => this.meeting_type === 'Call';

    getDuration = () => this.isCall() ? 30 : 60;
}

export default Meeting
