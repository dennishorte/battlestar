import { vi } from 'vitest'

const logger = {
  info: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn()
}

export default logger
