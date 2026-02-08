const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Plow Hero (C091)', () => {
  test('offers plow for food when using plow-field with first person', () => {
    const card = res.getCardById('plow-hero-c091')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.getPersonPlacedThisRound = () => 1
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'plow-field')

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card)
  })

  test('offers plow for food when using plow-sow with first person', () => {
    const card = res.getCardById('plow-hero-c091')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.getPersonPlacedThisRound = () => 1
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'plow-sow')

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when not first person placed', () => {
    const card = res.getCardById('plow-hero-c091')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.getPersonPlacedThisRound = () => 2
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'plow-field')

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('does not offer when player lacks food', () => {
    const card = res.getCardById('plow-hero-c091')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getPersonPlacedThisRound = () => 1
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'plow-field')

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('plow-hero-c091')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.getPersonPlacedThisRound = () => 1
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })
})
