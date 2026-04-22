const card = require('./diplomacy.js')

describe('Diplomacy', () => {
  test('data', () => {
    expect(card.id).toBe('diplomacy')
    expect(card.name).toBe('Diplomacy')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
