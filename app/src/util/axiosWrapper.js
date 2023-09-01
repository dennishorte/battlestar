import axios from 'axios'

const appVersion = require('@/assets/version.js')


export default {
  post,
}


async function post(path, body) {
  if (body === undefined) {
    body = {}
  }

  if (!(body instanceof Object)) {
    throw new Error('Please send only objects as the body of post requests')
  }

  // Insert the current app version into the request
  body.appVersion = appVersion

  const response = await axios.post(path, body)

  if (response.data.status === 'success') {
    return response.data
  }

  else if (response.data.status === 'version_mismatch') {
    alert('App version out of date. Please reload this page.')
    console.log({
      currentVersion: appVersion,
      latestVersion: response.data.latestVersion,
    })
    throw new Error('App version out of date')
  }

  else if (response.data.status === 'error') {
    console.log(response.data)
    throw new Error('Recieved error from server')
  }

  else {
    alert('Unknown response status: ' + response.data.status)
    console.log(response.data)
    throw new Error('Invalid response from server')
  }
}
