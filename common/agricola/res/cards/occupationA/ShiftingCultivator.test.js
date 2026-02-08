const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Shifting Cultivator (OccA 091)', () => {
  test('offers plow for 3 food when using take-wood', () => {
    const card = res.getCardById('shifting-cultivator-a091')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card, 3)
  })

  test('offers plow when using copse', () => {
    const card = res.getCardById('shifting-cultivator-a091')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'copse')

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card, 3)
  })

  test('offers plow when using take-3-wood', () => {
    const card = res.getCardById('shifting-cultivator-a091')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card, 3)
  })

  test('offers plow when using take-2-wood', () => {
    const card = res.getCardById('shifting-cultivator-a091')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 4
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'take-2-wood')

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card, 3)
  })

  test('does not offer plow with insufficient food', () => {
    const card = res.getCardById('shifting-cultivator-a091')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('shifting-cultivator-a091')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 10
    game.offerPlowForFood = jest.fn()

    card.onAction(game, dennis, 'take-clay')

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })
})
