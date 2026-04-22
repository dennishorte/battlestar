const card = require('./conflict-battle-for-arrakeen-uprising.js')

describe('conflict-battle-for-arrakeen-uprising', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-battle-for-arrakeen-uprising')
    expect(card.name).toBe('Battle for Arrakeen')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(3)
  })
})
