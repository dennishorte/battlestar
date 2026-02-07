const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Profiteering (E082)', () => {
  test('gives 1 food on play', () => {
    const card = res.getCardById('profiteering-e082')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
  })
})
