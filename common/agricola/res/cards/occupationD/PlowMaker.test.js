const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Plow Maker (OccD 090)', () => {
  test('offers extra plow when using plow-field with food', () => {
    const card = res.getCardById('plow-maker-d090')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerPlowForFood: jest.fn() }

    card.onAction(game, dennis, 'plow-field')

    expect(game.actions.offerPlowForFood).toHaveBeenCalledWith(dennis, card)
  })

  test('offers extra plow when using plow-sow with food', () => {
    const card = res.getCardById('plow-maker-d090')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerPlowForFood: jest.fn() }

    card.onAction(game, dennis, 'plow-sow')

    expect(game.actions.offerPlowForFood).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer plow when player has no food', () => {
    const card = res.getCardById('plow-maker-d090')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.actions = { offerPlowForFood: jest.fn() }

    card.onAction(game, dennis, 'plow-field')

    expect(game.actions.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('plow-maker-d090')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerPlowForFood: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerPlowForFood).not.toHaveBeenCalled()
  })
})
