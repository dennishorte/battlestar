import { WebClient } from '@slack/web-api'
import logger from '../../utils/logger.js'

const token = process.env.SLACK_BOT_TOKEN
const client = new WebClient(token)

export function buildMessage({ text, url, urlTitle, suffix }) {
  const link = `<${url}|${urlTitle}>`
  return suffix ? `${text} ${link}\n${suffix}` : `${text} ${link}`
}

export async function send(slackId, message) {
  try {
    await client.chat.postMessage({
      channel: slackId,
      text: message,
      unfurl_links: false,
      unfurl_media: false,
    })
    logger.debug(`Sent Slack message to ${slackId}`)
  }
  catch (error) {
    logger.error(`Failed to send Slack message: ${error.message}`)
  }
}
