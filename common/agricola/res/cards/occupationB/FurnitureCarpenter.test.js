const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Furniture Carpenter (B101)', () => {
  test('offers buy bonus point when any player owns Joinery and player has food', () => {
    const card = res.getCardById('furniture-carpenter-b101')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.anyPlayerOwnsJoinery = jest.fn().mockReturnValue(true)
    game.actions = { offerBuyBonusPoint: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerBuyBonusPoint).toHaveBeenCalledWith(dennis, card, 2)
  })

  test('does not offer when no player owns Joinery', () => {
    const card = res.getCardById('furniture-carpenter-b101')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.anyPlayerOwnsJoinery = jest.fn().mockReturnValue(false)
    game.actions = { offerBuyBonusPoint: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerBuyBonusPoint).not.toHaveBeenCalled()
  })

  test('does not offer when player has less than 2 food', () => {
    const card = res.getCardById('furniture-carpenter-b101')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.anyPlayerOwnsJoinery = jest.fn().mockReturnValue(true)
    game.actions = { offerBuyBonusPoint: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerBuyBonusPoint).not.toHaveBeenCalled()
  })
})
