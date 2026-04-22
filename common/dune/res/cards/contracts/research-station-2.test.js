const card = require('./research-station-2.js')

describe('Research Station (contract) [research-station-2]', () => {
  test('data', () => {
    expect(card.id).toBe('research-station-2')
    expect(card.name).toBe('Research Station')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
