import LocationAccess from '../utils/LocationAccessModule'

const TIMEOUT_MS = 5 * 1000

export const getLocation = () => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('timeout')
    }, TIMEOUT_MS)
  })
  return Promise.race([timeout, LocationAccess.requestLocation()])
}

export const checkLocationAccess = () => {
  return new Promise((resolve, reject) => {
    LocationAccess.checkLocationAccess().then(response => {
      if (response == 'success') {
        resolve()
      } else {
        reject()
      }
    }).catch(error => {
      reject(error)
    })
  })
}
