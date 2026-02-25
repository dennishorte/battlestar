const major = require('../major')

describe('Fireplace (fireplace-4) [5-6 expansion]', () => {
  test('card data', () => {
    const card = major.getCardById('fireplace-4')
    expect(card.expansion).toBe('5-6')
    expect(card.cost).toEqual({ clay: 4 })
    expect(card.abilities.canCook).toBe(true)
    expect(card.abilities.canBake).toBe(true)
  })

  test('included in 5+ player games', () => {
    const cards = major.getCardsByPlayerCount(5)
    expect(cards.find(c => c.id === 'fireplace-4')).toBeDefined()
  })

  test('excluded from 4 player games', () => {
    const cards = major.getCardsByPlayerCount(4)
    expect(cards.find(c => c.id === 'fireplace-4')).toBeUndefined()
  })
})
