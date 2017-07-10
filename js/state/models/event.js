import Immutable, {Map, OrderedMap}  from 'immutable'
import User from './user'
import {getMeetingTypeIcon} from './meeting'
import {getDay, getMonth} from '../../utils/DateTime'
import moment from 'moment'


const EventRecord = Immutable.Record({
  begin: undefined,
  end: undefined,
  name: undefined,
}, 'EventRecord')

class Event extends EventRecord {
  constructor(args) {
    super({...args,
           begin: moment(args.begin),
           end: moment(args.end),
    })
  }
}

export default Event
