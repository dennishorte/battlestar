const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Little Stick Knitter (B092)', () => {
  test('offers family growth when using Sheep Market in round 5+', () => {
    const card = res.getCardById('little-stick-knitter-b092')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.canGrowFamily = jest.fn().mockReturnValue(true)
    game.actions = { offerFamilyGrowthWithRoom: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerFamilyGrowthWithRoom).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer before round 5', () => {
    const card = res.getCardById('little-stick-knitter-b092')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 4

    const dennis = t.player(game)
    dennis.canGrowFamily = jest.fn().mockReturnValue(true)
    game.actions = { offerFamilyGrowthWithRoom: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerFamilyGrowthWithRoom).not.toHaveBeenCalled()
  })

  test('does not offer when cannot grow family', () => {
    const card = res.getCardById('little-stick-knitter-b092')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 6

    const dennis = t.player(game)
    dennis.canGrowFamily = jest.fn().mockReturnValue(false)
    game.actions = { offerFamilyGrowthWithRoom: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerFamilyGrowthWithRoom).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('little-stick-knitter-b092')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()
    game.state.round = 7

    const dennis = t.player(game)
    dennis.canGrowFamily = jest.fn().mockReturnValue(true)
    game.actions = { offerFamilyGrowthWithRoom: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerFamilyGrowthWithRoom).not.toHaveBeenCalled()
  })
})
