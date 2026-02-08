const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ash Trees (E074)', () => {
  test('places up to 5 fences on card from supply', () => {
    const card = res.getCardById('ash-trees-e074')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.fencesRemaining = 10

    card.onPlay(game, dennis)

    expect(card.storedFences).toBe(5)
    expect(dennis.fencesRemaining).toBe(5)
  })

  test('places fewer fences if supply is limited', () => {
    const card = res.getCardById('ash-trees-e074')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.fencesRemaining = 3

    card.onPlay(game, dennis)

    expect(card.storedFences).toBe(3)
    expect(dennis.fencesRemaining).toBe(0)
  })

  test('getFreeFences returns stored fences', () => {
    const card = res.getCardById('ash-trees-e074')
    card.storedFences = 4

    expect(card.getFreeFences()).toBe(4)
  })

  test('getFreeFences returns 0 when no stored fences', () => {
    const card = res.getCardById('ash-trees-e074')
    card.storedFences = undefined

    expect(card.getFreeFences()).toBe(0)
  })
})
