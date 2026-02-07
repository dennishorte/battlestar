const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Carpenter's Axe (A015)", () => {
  test('offers stable building when player has 7+ wood after wood action', () => {
    const card = res.getCardById('carpenters-axe-a015')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 7

    let offerCalled = false
    game.actions.offerBuildStableForWood = (player, sourceCard, cost) => {
      offerCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(cost).toBe(1)
    }

    card.onAction(game, dennis, 'take-wood')

    expect(offerCalled).toBe(true)
  })

  test('does not offer when player has less than 7 wood', () => {
    const card = res.getCardById('carpenters-axe-a015')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 6

    let offerCalled = false
    game.actions.offerBuildStableForWood = () => {
      offerCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(offerCalled).toBe(false)
  })

  test('does not trigger on non-wood actions', () => {
    const card = res.getCardById('carpenters-axe-a015')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 10

    let offerCalled = false
    game.actions.offerBuildStableForWood = () => {
      offerCalled = true
    }

    card.onAction(game, dennis, 'take-clay')

    expect(offerCalled).toBe(false)
  })
})
