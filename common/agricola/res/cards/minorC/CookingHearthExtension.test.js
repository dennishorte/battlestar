const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cooking Hearth Extension (C062)', () => {
  test('has onHarvest hook', () => {
    const card = res.getCardById('cooking-hearth-extension-c062')
    expect(card.onHarvest).toBeDefined()
  })

  test('calls offerCookingHearthExtension action on harvest', () => {
    const card = res.getCardById('cooking-hearth-extension-c062')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerCookingHearthExtension = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onHarvest(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
