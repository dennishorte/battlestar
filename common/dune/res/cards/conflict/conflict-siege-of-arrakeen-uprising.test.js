const card = require('./conflict-siege-of-arrakeen-uprising.js')

describe('conflict-siege-of-arrakeen-uprising', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-siege-of-arrakeen-uprising')
    expect(card.name).toBe('Siege of Arrakeen')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
