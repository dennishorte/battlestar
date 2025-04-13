import axios from 'axios'

const appVersion = require('@/assets/version.js')
const modalWrapper = require('@/util/modal.js').default


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

  try {
    const response = await axios.post(path, body)

    if (response.data.status === 'success') {
      return response.data
    }

    else if (response.data.status === 'error') {
      alert('Received error from server. See console for details.')
      console.log(response.data)
      throw new Error('Recieved error from server')
    }

    else {
      alert('Unknown response status: ' + response.data.status)
      console.log(response.data)
      throw new Error('Invalid response from server')
    }
  }
  catch (e) {
    if (e.response.data.code === 'game_overwrite') {
      modalWrapper.pleaseReload('Your actions will overwrite the actions of another player.')
      console.log(e.response.data)
      throw e
    }

    else if (e.response.data.code === 'version_mismatch') {
      modalWrapper.pleaseReload('App version out of date. Please reload this page and try again.')
      console.log({
        currentVersion: appVersion,
        latestVersion: e.response.data.latestVersion,
      })
      throw e
    }

    else {
      throw e
    }
  }
}
