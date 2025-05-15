import { vi } from 'vitest'

const GameOverEvent = vi.fn()
const fromData = vi.fn(data => data)

export { GameOverEvent, fromData }
