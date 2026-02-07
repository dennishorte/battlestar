const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Basket (A056)', () => {
  test('offers wood for food exchange on take-wood action', () => {
    const card = res.getCardById('basket-a056')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3

    let offerCalled = false
    game.actions.offerWoodForFoodExchange = (player, sourceCard, exchange) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(exchange).toEqual({ wood: 2, food: 3 })
    }

    card.onAction(game, dennis, 'take-wood')

    expect(offerCalled).toBe(true)
  })

  test('does not offer exchange when player has less than 2 wood', () => {
    const card = res.getCardById('basket-a056')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1

    let offerCalled = false
    game.actions.offerWoodForFoodExchange = () => {
      offerCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(offerCalled).toBe(false)
  })

  test('does not trigger on non-wood actions', () => {
    const card = res.getCardById('basket-a056')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5

    let offerCalled = false
    game.actions.offerWoodForFoodExchange = () => {
      offerCalled = true
    }

    card.onAction(game, dennis, 'take-clay')

    expect(offerCalled).toBe(false)
  })
})
