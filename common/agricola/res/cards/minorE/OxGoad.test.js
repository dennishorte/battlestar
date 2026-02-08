const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ox Goad (E019)', () => {
  test('offers plow for food after cattle-market action', () => {
    const card = res.getCardById('ox-goad-e019')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5

    let offerMade = false
    game.actions.offerPlowForFood = (player, sourceCard, foodCost) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(foodCost).toBe(2)
    }

    card.onAction(game, dennis, 'cattle-market')

    expect(offerMade).toBe(true)
  })

  test('does not offer when player has less than 2 food', () => {
    const card = res.getCardById('ox-goad-e019')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1

    let offerMade = false
    game.actions.offerPlowForFood = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'cattle-market')

    expect(offerMade).toBe(false)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('ox-goad-e019')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 10

    let offerMade = false
    game.actions.offerPlowForFood = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'sheep-market')

    expect(offerMade).toBe(false)
  })
})
