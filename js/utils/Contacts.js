import Contacts from 'react-native-contacts'
import { Store } from '../index'
import { switchPermissionsOff, newContacts } from '../state/actions/app'

export const loadContacts = () => {
  Contacts.checkPermission( (err, permission) => {
    console.log(permission)
    if(permission != 'authorized'){
      Store.dispatch(switchPermissionsOff())
      return
    }
    Contacts.getAll((err, contacts) => {
      console.log(err)
      if(err === 'denied'){
        // x.x
        console.log('Contacts denied')

      } else {
        console.log('Contacts')
        console.log(contacts)

        emails = this._reduceContacts(contacts, 'emailAddresses', 'email')
        numbers = this._reduceContacts(contacts, 'phoneNumbers', 'number')
        console.log(emails)
        Store.dispatch(newContacts(numbers, emails))
      }
    })
  })

}

_reduceContacts = (contacts, field, secondField) => contacts.reduce((newArray, item, i) => {
  console.log(item[field])
  if (item[field].length > 0) {
    let contact = item[field][0][secondField]
    if (field == 'phoneNumbers') {
      filteredContact = item[field].filter(item=> item.label == 'mobile')
      if (filteredContact.length > 0) {
        contact = filteredContact[0][secondField]
      }
    }
    newArray.push({
      id: i,
      firstName: item.givenName,
      middleName: item.middleName,
      lastName: item.familyName,
      contact: contact,
      thumbnailPath: item.thumbnailPath,
      hasThumbnail: item.hasThumbnail
    })
  }
  return newArray
}, []);
