const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Paper Knife', () => {
  test('triggers paper knife effect on play', () => {
    const card = res.getCardById('paper-knife-a003')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['paper-knife-a003'],
        hand: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    const dennis = t.dennis(game)

    let effectCalled = false
    game.actions.paperKnifeEffect = (player, sourceCard) => {
      effectCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(effectCalled).toBe(true)
  })
})
