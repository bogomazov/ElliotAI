import Immutable, {Map, OrderedMap}  from 'immutable'


const UserRecord = Immutable.Record({
  fb_id: undefined,
  first_name: undefined,
  last_name: undefined,
  image: undefined
}, 'UserRecord')

class User extends UserRecord {
  
}

export default User
