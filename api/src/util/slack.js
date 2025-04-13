const { WebClient } = require('@slack/web-api')
const logger = require('../utils/logger')
const db = require('../models/db.js')

let client = null

// Initialize Slack client if token is available
if (process.env.SLACK_TOKEN) {
  client = new WebClient(process.env.SLACK_TOKEN)
}

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

/**
 * Send a Slack message to a user
 * 
 * @param {Object|string} user - User object or user ID
 * @param {string} message - Message text to send
 * @returns {Promise<void>}
 */
async function sendMessage(user, message) {
  if (!client) {
    logger.warn('Slack client not initialized. Message not sent.')
    return
  }
  
  try {
    const userId = typeof user === 'object' ? user._id : user
    
    // If we have a Slack user ID mapping, use it
    const slackId = typeof user === 'object' && user.slack ? user.slack : userId
    
    if (!slackId) {
      logger.warn(`Cannot send Slack message: No Slack ID for user ${userId}`)
      return
    }
    
    await client.chat.postMessage({
      channel: slackId,
      text: message,
      unfurl_links: false,
      unfurl_media: false
    })
    
    logger.debug(`Sent Slack message to ${slackId}`)
  } catch (error) {
    logger.error(`Failed to send Slack message: ${error.message}`)
  }
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
