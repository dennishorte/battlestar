const major = require('../major')

describe('Pottery (pottery-2) [5-6 expansion]', () => {
  test('card data', () => {
    const card = major.getCardById('pottery-2')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ clay: 2, stone: 3 })
    expect(card.harvestConversion.resource).toBe('clay')
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'pottery-2')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'pottery-2')).toBeUndefined()
  })
})
