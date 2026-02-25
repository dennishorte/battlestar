const major = require('../major')

describe('Clay Oven (clay-oven-2) [5-6 expansion]', () => {
  test('card data', () => {
    const card = major.getCardById('clay-oven-2')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ clay: 4, stone: 1 })
    expect(card.abilities.bakingRate).toBe(5)
    expect(card.abilities.bakingLimit).toBe(1)
    expect(card.onBuy).toBeDefined()
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'clay-oven-2')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'clay-oven-2')).toBeUndefined()
  })
})
