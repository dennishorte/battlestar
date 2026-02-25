const major = require('../major')

describe('Cooking Hearth (cooking-hearth-6) [5-6 expansion]', () => {
  test('card data', () => {
    const card = major.getCardById('cooking-hearth-6')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ clay: 6 })
    expect(card.upgradesFrom).toEqual(['fireplace-2', 'fireplace-3', 'fireplace-4'])
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'cooking-hearth-6')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'cooking-hearth-6')).toBeUndefined()
  })
})
