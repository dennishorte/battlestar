const card = require('./signet-ring.js')

describe('Signet Ring', () => {
  test('data', () => {
    expect(card.id).toBe('signet-ring')
    expect(card.name).toBe('Signet Ring')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
