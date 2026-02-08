const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Beer Stein (C061)', () => {
  test('has onBake hook', () => {
    const card = res.getCardById('beer-stein-c061')
    expect(card.onBake).toBeDefined()
  })

  test('offers beer stein effect when player has grain', () => {
    const card = res.getCardById('beer-stein-c061')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    let actionCalled = false

    game.actions.offerBeerStein = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onBake(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('does not offer effect when player has no grain', () => {
    const card = res.getCardById('beer-stein-c061')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    let actionCalled = false

    game.actions.offerBeerStein = () => {
      actionCalled = true
    }

    card.onBake(game, dennis)

    expect(actionCalled).toBe(false)
  })
})
