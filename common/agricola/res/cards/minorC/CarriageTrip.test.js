const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Carriage Trip (C003)', () => {
  test('has onPlay hook that calls placeExtraPerson', () => {
    const card = res.getCardById('carriage-trip-c003')
    expect(card.onPlay).toBeDefined()
  })

  test('calls placeExtraPerson action on play', () => {
    const card = res.getCardById('carriage-trip-c003')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.placeExtraPerson = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
