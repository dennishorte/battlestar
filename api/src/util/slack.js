const db = require('../models/db.js')


const { WebClient } = require('@slack/web-api')

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_BOT_TOKEN
const web = new WebClient(token)

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const dennisUserId = 'U3SHZPJF5'

module.exports = {
  sendMessage,
  test,
}


async function sendMessage(userId, message) {
  const user = await db.user.findById(userId)
  const slackId = user.slack

  if (!slackId)
    return

  return await web.chat.postMessage({ channel: slackId, text: message })
}

async function test() {
  // See: https://api.slack.com/methods/chat.postMessage
  const res = await web.chat.postMessage({ channel: dennisUserId, text: 'Hello there' })

  // `res` contains information about the posted message
  console.log('Message sent: ', res.ts)

  return res
}
