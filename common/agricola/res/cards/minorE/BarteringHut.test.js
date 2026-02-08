const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bartering Hut (E009)', () => {
  test('calls barteringHut action on play', () => {
    const card = res.getCardById('bartering-hut-e009')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.barteringHut = (player, sourceCard) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
