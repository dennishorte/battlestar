/* global fetch */
import logger from '../../utils/logger.js'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function buildMessage({ text, url, urlTitle, suffix }) {
  const link = `<a href="${url}">${escapeHtml(urlTitle)}</a>`
  return suffix ? `${text} ${link}\n${suffix}` : `${text} ${link}`
}

export async function send(chatId, message) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    logger.warn('Telegram bot token not configured. Message not sent.')
    return
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Telegram API ${res.status}: ${body}`)
    }

    logger.debug(`Sent Telegram message to ${chatId}`)
  }
  catch (error) {
    logger.error(`Failed to send Telegram message: ${error.message}`)
  }
}
