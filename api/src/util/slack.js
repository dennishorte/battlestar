const db = require('../models/db.js')


const { WebClient } = require('@slack/web-api')

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_BOT_TOKEN
const web = new WebClient(token)

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const dennisUserId = 'U3SHZPJF5'
const cloChannelId = 'C01AV1RGJSK'

module.exports = {
  sendMessage,
  sendToSlackId,
  test,
}

async function sendToSlackId(slackId, message) {
  return await web.chat.postMessage({ channel: slackId, text: message })
}

async function sendMessage(userId, message) {
  const user = await db.user.findById(userId)
  const slackId = user.slack

  if (!slackId)
    return

  await sendToSlackId(slackId, message)
}

async function test() {
  // See: https://api.slack.com/methods/chat.postMessage

  const message = `{username} unlocked an achievement!

*{ach.name}*
>{ach.text}`

  const res = await web.chat.postMessage({ channel: cloChannelId, text: message })

  // `res` contains information about the posted message
  console.log('Message sent: ', res.ts)

  return res
}
