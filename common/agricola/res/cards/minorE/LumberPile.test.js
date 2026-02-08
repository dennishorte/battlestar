const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lumber Pile (E076)', () => {
  test('calls lumberPileExchange action on play', () => {
    const card = res.getCardById('lumber-pile-e076')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.lumberPileExchange = (player, sourceCard) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
