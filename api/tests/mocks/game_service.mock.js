import { vi } from 'vitest'

const gameService = {
  create: vi.fn().mockResolvedValue({ _id: 'new-game-id' }),
  kill: vi.fn().mockResolvedValue({}),
  rematch: vi.fn().mockResolvedValue({ _id: 'new-lobby-id' }),
  saveFull: vi.fn().mockResolvedValue({ id: 'game-id', state: 'updated' }),
  saveResponse: vi.fn().mockResolvedValue({ id: 'game-id', state: 'response-saved' }),
  undo: vi.fn().mockResolvedValue({ id: 'game-id', state: 'undo-applied' })
}

export default gameService
