const card = require('./guild-impersonator.js')

describe('Guild Impersonator', () => {
  test('data', () => {
    expect(card.id).toBe('guild-impersonator')
    expect(card.name).toBe('Guild Impersonator')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
