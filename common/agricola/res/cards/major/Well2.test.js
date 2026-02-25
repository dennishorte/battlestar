const major = require('../major')

describe('Well (well-2) [5-6 expansion]', () => {
  test('card data', () => {
    const card = major.getCardById('well-2')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ stone: 3, clay: 1 })
    expect(card.victoryPoints).toBe(4)
    expect(card.onBuy).toBeDefined()
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'well-2')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'well-2')).toBeUndefined()
  })
})
