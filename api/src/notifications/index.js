import logger from '../utils/logger.js'
import * as slack from './providers/slack.js'
import * as telegram from './providers/telegram.js'

const providers = {
  slack,
  telegram,
}

async function send(user, descriptor) {
  if (process.env.NODE_ENV !== 'production' && !process.env.NOTIFICATIONS_DEV) {
    return
  }

  const tasks = Object.entries(providers)
    .filter(([name]) => user[name])
    .map(async ([name, provider]) => {
      const message = provider.buildMessage(descriptor)
      await provider.send(user[name], message)
    })

  const results = await Promise.allSettled(tasks)

  for (const result of results) {
    if (result.status === 'rejected') {
      logger.error(`Notification provider failed: ${result.reason}`)
    }
  }
}

export default { send }
