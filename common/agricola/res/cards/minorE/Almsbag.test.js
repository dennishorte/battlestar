const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Almsbag (E065)', () => {
  test('gives grain based on completed rounds', () => {
    const card = res.getCardById('almsbag-e065')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 7 // 6 completed rounds

    const dennis = t.player(game)
    dennis.grain = 0

    card.onPlay(game, dennis)

    // 6 completed rounds / 2 = 3 grain
    expect(dennis.grain).toBe(3)
  })
})
