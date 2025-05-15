import { vi } from 'vitest'

const Strategy = vi.fn()
const ExtractJwt = {
  fromAuthHeaderAsBearerToken: vi.fn()
}

export { Strategy, ExtractJwt }
