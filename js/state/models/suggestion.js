import Immutable, {Map, OrderedMap}  from 'immutable'
import User from './user'
import Event from './event'
import {getMeetingTypeIcon} from './meeting'
import {getDay, getMonth} from '../../utils/DateTime'
import moment from 'moment'


const SuggestionRecord = Immutable.Record({
  id: undefined,
  meeting_time: undefined,
  friend: undefined,
  meeting_type: undefined,
  is_invite: undefined,
  message: undefined,
  meeting_times: undefined,
  events: undefined
}, 'SuggestionRecord')

class Suggestion extends SuggestionRecord {
  constructor(args) {
    super({...args,
           friend: new User(args.friend),
           meeting_time: moment(args.meeting_time),
           meeting_times: args.meeting_times.map(time => moment(time)),
           events: args.events? args.events.map((event) => new Event(event)): []
    })
  }

  getIcon = () => getMeetingTypeIcon(this.meeting_type)

  getDateStr = () => this.meeting_time.format('dddd, MMM D')
//   `${getDay(this.meeting_time)}, ${getMonth(this.meeting_time)} ${this.meeting_time.getDate()}`
}

export default Suggestion
