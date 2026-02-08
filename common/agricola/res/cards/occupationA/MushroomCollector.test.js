const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mushroom Collector (OccA 108)', () => {
  test('offers wood for food exchange when using take-wood', () => {
    const card = res.getCardById('mushroom-collector-a108')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    game.actions = { offerWoodForFoodExchange: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerWoodForFoodExchange).toHaveBeenCalledWith(
      dennis, card, { wood: 1, food: 2 }
    )
  })

  test('offers exchange when using copse', () => {
    const card = res.getCardById('mushroom-collector-a108')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerWoodForFoodExchange: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerWoodForFoodExchange).toHaveBeenCalledWith(
      dennis, card, { wood: 1, food: 2 }
    )
  })

  test('offers exchange when using take-3-wood', () => {
    const card = res.getCardById('mushroom-collector-a108')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerWoodForFoodExchange: jest.fn() }

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.actions.offerWoodForFoodExchange).toHaveBeenCalled()
  })

  test('offers exchange when using take-2-wood', () => {
    const card = res.getCardById('mushroom-collector-a108')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerWoodForFoodExchange: jest.fn() }

    card.onAction(game, dennis, 'take-2-wood')

    expect(game.actions.offerWoodForFoodExchange).toHaveBeenCalled()
  })

  test('does not offer exchange without wood', () => {
    const card = res.getCardById('mushroom-collector-a108')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerWoodForFoodExchange: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerWoodForFoodExchange).not.toHaveBeenCalled()
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('mushroom-collector-a108')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions = { offerWoodForFoodExchange: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerWoodForFoodExchange).not.toHaveBeenCalled()
  })
})
