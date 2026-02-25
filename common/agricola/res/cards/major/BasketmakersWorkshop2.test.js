const major = require('../major')

describe("Basketmaker's Workshop (basketmakers-workshop-2) [5-6 expansion]", () => {
  test('card data', () => {
    const card = major.getCardById('basketmakers-workshop-2')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ reed: 2, stone: 3 })
    expect(card.abilities.harvestConversion.resource).toBe('reed')
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'basketmakers-workshop-2')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'basketmakers-workshop-2')).toBeUndefined()
  })
})
