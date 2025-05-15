import { vi } from 'vitest'

const stats = {
  processInnovationStats: vi.fn().mockResolvedValue({ stats: 'test stats' })
}

export default stats
