const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Automatic Water Trough (C009)', () => {
  test('has onPlay hook that calls automaticWaterTroughPurchase', () => {
    const card = res.getCardById('automatic-water-trough-c009')
    expect(card.onPlay).toBeDefined()
  })

  test('calls automaticWaterTroughPurchase action on play', () => {
    const card = res.getCardById('automatic-water-trough-c009')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.automaticWaterTroughPurchase = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
