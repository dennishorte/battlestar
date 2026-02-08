const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Excavator (C126)', () => {
  test('gives 1 wood and 1 clay and offers stone purchase when using day laborer', () => {
    const card = res.getCardById('excavator-c126')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    dennis.food = 2
    game.log = { add: jest.fn() }
    game.actions = { offerBuyStone: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.wood).toBe(1)
    expect(dennis.clay).toBe(1)
    expect(game.actions.offerBuyStone).toHaveBeenCalledWith(dennis, card, 1, 1)
  })

  test('does not offer stone purchase when player has no food', () => {
    const card = res.getCardById('excavator-c126')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    dennis.food = 0
    game.log = { add: jest.fn() }
    game.actions = { offerBuyStone: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.wood).toBe(1)
    expect(dennis.clay).toBe(1)
    expect(game.actions.offerBuyStone).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('excavator-c126')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
    expect(dennis.clay).toBe(0)
  })
})
