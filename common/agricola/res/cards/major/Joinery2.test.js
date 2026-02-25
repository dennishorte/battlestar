const major = require('../major')

describe('Joinery (joinery-2) [5-6 expansion]', () => {
  test('card data', () => {
    const card = major.getCardById('joinery-2')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ wood: 2, stone: 3 })
    expect(card.abilities.harvestConversion.resource).toBe('wood')
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'joinery-2')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'joinery-2')).toBeUndefined()
  })
})
