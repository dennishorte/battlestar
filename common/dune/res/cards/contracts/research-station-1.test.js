const card = require('./research-station-1.js')

describe('Research Station (contract) [research-station-1]', () => {
  test('data', () => {
    expect(card.id).toBe('research-station-1')
    expect(card.name).toBe('Research Station')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
