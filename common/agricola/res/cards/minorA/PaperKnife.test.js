const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Paper Knife (A003)', () => {
  test('triggers paper knife effect on play', () => {
    const card = res.getCardById('paper-knife-a003')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

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
