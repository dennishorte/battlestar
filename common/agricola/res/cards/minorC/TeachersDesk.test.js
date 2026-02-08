const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Teacher's Desk (C028)", () => {
  test('has onAction hook', () => {
    const card = res.getCardById('teachers-desk-c028')
    expect(card.onAction).toBeDefined()
  })

  test('offers occupation on major-improvement action', () => {
    const card = res.getCardById('teachers-desk-c028')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerOccupationForFood = (player, cardArg, foodCost) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
      expect(foodCost).toBe(1)
    }

    card.onAction(game, dennis, 'major-improvement')

    expect(actionCalled).toBe(true)
  })

  test('offers occupation on house-redevelopment action', () => {
    const card = res.getCardById('teachers-desk-c028')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerOccupationForFood = (player, cardArg, foodCost) => {
      actionCalled = true
      expect(foodCost).toBe(1)
    }

    card.onAction(game, dennis, 'house-redevelopment')

    expect(actionCalled).toBe(true)
  })

  test('does not trigger on other actions', () => {
    const card = res.getCardById('teachers-desk-c028')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerOccupationForFood = () => {
      actionCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(actionCalled).toBe(false)
  })
})
