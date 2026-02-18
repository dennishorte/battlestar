import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'

vi.mock('../../../src/utils/logger.js', () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }
}))

vi.mock('../../../src/notifications/providers/slack.js', () => ({
  buildMessage: vi.fn(d => `slack:${d.text}`),
  send: vi.fn(),
}))

vi.mock('../../../src/notifications/providers/telegram.js', () => ({
  buildMessage: vi.fn(d => `telegram:${d.text}`),
  send: vi.fn(),
}))

import notifications from '../../../src/notifications/index.js'
import * as slack from '../../../src/notifications/providers/slack.js'
import * as telegram from '../../../src/notifications/providers/telegram.js'
import logger from '../../../src/utils/logger.js'

describe('Notifications dispatcher', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, NODE_ENV: 'production' }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  const descriptor = { text: 'Hello', url: 'http://example.com', urlTitle: 'Test' }

  it('should send to both slack and telegram when user has both configured', async () => {
    const user = { slack: 'S123', telegram: '456' }

    await notifications.send(user, descriptor)

    expect(slack.buildMessage).toHaveBeenCalledWith(descriptor)
    expect(slack.send).toHaveBeenCalledWith('S123', 'slack:Hello')
    expect(telegram.buildMessage).toHaveBeenCalledWith(descriptor)
    expect(telegram.send).toHaveBeenCalledWith('456', 'telegram:Hello')
  })

  it('should send only to slack when user has only slack configured', async () => {
    const user = { slack: 'S123' }

    await notifications.send(user, descriptor)

    expect(slack.send).toHaveBeenCalledWith('S123', 'slack:Hello')
    expect(telegram.send).not.toHaveBeenCalled()
  })

  it('should send only to telegram when user has only telegram configured', async () => {
    const user = { telegram: '456' }

    await notifications.send(user, descriptor)

    expect(telegram.send).toHaveBeenCalledWith('456', 'telegram:Hello')
    expect(slack.send).not.toHaveBeenCalled()
  })

  it('should send nothing when user has no channels configured', async () => {
    const user = { _id: 'user1' }

    await notifications.send(user, descriptor)

    expect(slack.send).not.toHaveBeenCalled()
    expect(telegram.send).not.toHaveBeenCalled()
  })

  it('should not block other providers when one fails', async () => {
    const user = { slack: 'S123', telegram: '456' }
    slack.send.mockRejectedValueOnce(new Error('Slack down'))

    await notifications.send(user, descriptor)

    expect(telegram.send).toHaveBeenCalledWith('456', 'telegram:Hello')
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Slack down'))
  })

  it('should not send in non-production without NOTIFICATIONS_DEV', async () => {
    process.env.NODE_ENV = 'development'
    delete process.env.NOTIFICATIONS_DEV
    const user = { slack: 'S123' }

    await notifications.send(user, descriptor)

    expect(slack.send).not.toHaveBeenCalled()
  })

  it('should send in non-production when NOTIFICATIONS_DEV is set', async () => {
    process.env.NODE_ENV = 'development'
    process.env.NOTIFICATIONS_DEV = 'true'
    const user = { slack: 'S123' }

    await notifications.send(user, descriptor)

    expect(slack.send).toHaveBeenCalled()
  })
})
