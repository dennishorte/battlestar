const major = require('../major')

describe('Stone Oven (stone-oven-2) [5-6 expansion]', () => {
  test('card data', () => {
    const card = major.getCardById('stone-oven-2')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ clay: 2, stone: 3 })
    expect(card.abilities.bakingRate).toBe(4)
    expect(card.abilities.bakingLimit).toBe(2)
    expect(card.onBuy).toBeDefined()
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'stone-oven-2')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'stone-oven-2')).toBeUndefined()
  })
})
