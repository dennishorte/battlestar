const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sugar Baker (OccD 101)', () => {
  test('offers bonus point purchase when using sow-bake with food', () => {
    const card = res.getCardById('sugar-baker-d101')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerSugarBakerBonus: jest.fn() }

    card.onAction(game, dennis, 'sow-bake')

    expect(game.actions.offerSugarBakerBonus).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when player has no food', () => {
    const card = res.getCardById('sugar-baker-d101')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.actions = { offerSugarBakerBonus: jest.fn() }

    card.onAction(game, dennis, 'sow-bake')

    expect(game.actions.offerSugarBakerBonus).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('sugar-baker-d101')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerSugarBakerBonus: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerSugarBakerBonus).not.toHaveBeenCalled()
  })
})
