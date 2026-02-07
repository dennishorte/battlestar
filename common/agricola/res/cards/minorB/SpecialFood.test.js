const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Special Food (B034)', () => {
  test('sets specialFoodActive flag on play', () => {
    const card = res.getCardById('special-food-b034')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.specialFoodActive).toBe(true)
  })

  test('gives bonus points when taking and accommodating animals', () => {
    const card = res.getCardById('special-food-b034')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.specialFoodActive = true
    dennis.bonusPoints = 0

    card.onTakeAnimals(game, dennis, 3, true)

    expect(dennis.bonusPoints).toBe(3)
    expect(dennis.specialFoodActive).toBe(false)
  })

  test('does not give points when not all accommodated', () => {
    const card = res.getCardById('special-food-b034')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.specialFoodActive = true
    dennis.bonusPoints = 0

    card.onTakeAnimals(game, dennis, 3, false)

    expect(dennis.bonusPoints).toBe(0)
    expect(dennis.specialFoodActive).toBe(true)
  })

  test('does not give points when no animals taken', () => {
    const card = res.getCardById('special-food-b034')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.specialFoodActive = true
    dennis.bonusPoints = 0

    card.onTakeAnimals(game, dennis, 0, true)

    expect(dennis.bonusPoints).toBe(0)
  })

  test('does not trigger when already used', () => {
    const card = res.getCardById('special-food-b034')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.specialFoodActive = false
    dennis.bonusPoints = 0

    card.onTakeAnimals(game, dennis, 3, true)

    expect(dennis.bonusPoints).toBe(0)
  })

  test('requires no animals', () => {
    const card = res.getCardById('special-food-b034')
    expect(card.prereqs.noAnimals).toBe(true)
  })

  test('has no cost', () => {
    const card = res.getCardById('special-food-b034')
    expect(card.cost).toEqual({})
  })
})
