const card = require('./conflict-siege-of-arrakeen.js')

describe('conflict-siege-of-arrakeen', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-siege-of-arrakeen')
    expect(card.name).toBe('Siege of Arrakeen')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
