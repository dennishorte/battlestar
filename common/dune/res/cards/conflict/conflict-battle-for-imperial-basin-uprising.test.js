const card = require('./conflict-battle-for-imperial-basin-uprising.js')

describe('conflict-battle-for-imperial-basin-uprising', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-battle-for-imperial-basin-uprising')
    expect(card.name).toBe('Battle for Imperial Basin')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(3)
  })
})
