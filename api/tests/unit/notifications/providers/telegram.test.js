import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'

vi.mock('../../../../src/utils/logger.js', () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }
}))

import { buildMessage, send } from '../../../../src/notifications/providers/telegram.js'
import logger from '../../../../src/utils/logger.js'

describe('Telegram provider', () => {
  const originalEnv = process.env
  let fetchSpy

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv, TELEGRAM_BOT_TOKEN: 'test-token' }
    fetchSpy = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchSpy)
  })

  afterAll(() => {
    process.env = originalEnv
    vi.unstubAllGlobals()
  })

  describe('buildMessage', () => {
    it('should format a message with an HTML link', () => {
      const result = buildMessage({
        text: "You're up!",
        url: 'http://example.com/game/123',
        urlTitle: 'Agricola: My Game',
      })

      expect(result).toBe('You\'re up! <a href="http://example.com/game/123">Agricola: My Game</a>')
    })

    it('should include suffix on a new line when provided', () => {
      const result = buildMessage({
        text: 'Game over!',
        url: 'http://example.com/game/123',
        urlTitle: 'Agricola: My Game',
        suffix: 'Player 1 won!',
      })

      expect(result).toBe('Game over! <a href="http://example.com/game/123">Agricola: My Game</a>\nPlayer 1 won!')
    })

    it('should escape HTML characters in urlTitle', () => {
      const result = buildMessage({
        text: 'Hello',
        url: 'http://example.com',
        urlTitle: 'Game <script>alert("xss")</script>',
      })

      expect(result).toContain('&lt;script&gt;')
      expect(result).not.toContain('<script>')
    })

    it('should escape ampersands in urlTitle', () => {
      const result = buildMessage({
        text: 'Hello',
        url: 'http://example.com',
        urlTitle: 'Tom & Jerry',
      })

      expect(result).toContain('Tom &amp; Jerry')
    })
  })

  describe('send', () => {
    it('should call fetch with correct URL and body', async () => {
      await send('12345', 'Hello world')

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.telegram.org/bottest-token/sendMessage',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '12345',
            text: 'Hello world',
            parse_mode: 'HTML',
          }),
        }
      )
    })

    it('should log error on non-200 response', async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: () => Promise.resolve('Forbidden'),
      })

      await send('12345', 'Hello')

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Telegram API 403')
      )
    })

    it('should log error on network failure', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Network error'))

      await send('12345', 'Hello')

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Network error')
      )
    })

    it('should warn and return when token is not configured', async () => {
      delete process.env.TELEGRAM_BOT_TOKEN

      await send('12345', 'Hello')

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('not configured')
      )
      expect(fetchSpy).not.toHaveBeenCalled()
    })
  })
})
