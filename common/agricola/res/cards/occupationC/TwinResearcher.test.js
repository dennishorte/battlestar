const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Twin Researcher (C154)', () => {
  test('offers bonus point when accumulation spaces have same count', () => {
    const card = res.getCardById('twin-researcher-c154')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.getMatchingAccumulationSpace = () => 'take-wood'
    game.getAccumulatedCount = () => 3
    game.actions = { offerBuyBonusPoint: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerBuyBonusPoint).toHaveBeenCalledWith(dennis, card, 1)
  })

  test('does not offer when accumulation spaces have different counts', () => {
    const card = res.getCardById('twin-researcher-c154')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.getMatchingAccumulationSpace = () => 'take-wood'
    game.getAccumulatedCount = (actionId) => {
      if (actionId === 'copse') {
        return 3
      }
      return 5
    }
    game.actions = { offerBuyBonusPoint: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerBuyBonusPoint).not.toHaveBeenCalled()
  })

  test('does not offer when player lacks food', () => {
    const card = res.getCardById('twin-researcher-c154')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getMatchingAccumulationSpace = () => 'take-wood'
    game.getAccumulatedCount = () => 3
    game.actions = { offerBuyBonusPoint: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerBuyBonusPoint).not.toHaveBeenCalled()
  })

  test('does not offer when no matching accumulation space', () => {
    const card = res.getCardById('twin-researcher-c154')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.getMatchingAccumulationSpace = () => null
    game.actions = { offerBuyBonusPoint: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerBuyBonusPoint).not.toHaveBeenCalled()
  })
})
