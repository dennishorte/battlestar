const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Elephantgrass Plant (C034)', () => {
  test('has onHarvestEnd hook', () => {
    const card = res.getCardById('elephantgrass-plant-c034')
    expect(card.onHarvestEnd).toBeDefined()
  })

  test('offers exchange when player has reed', () => {
    const card = res.getCardById('elephantgrass-plant-c034')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 2
    let actionCalled = false

    game.actions.offerElephantgrassPlant = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onHarvestEnd(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('does not offer exchange when player has no reed', () => {
    const card = res.getCardById('elephantgrass-plant-c034')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    let actionCalled = false

    game.actions.offerElephantgrassPlant = () => {
      actionCalled = true
    }

    card.onHarvestEnd(game, dennis)

    expect(actionCalled).toBe(false)
  })
})
