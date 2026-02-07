const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pumpernickel (E007)', () => {
  test('gives 4 food', () => {
    const card = res.getCardById('pumpernickel-e007')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(4)
  })
})
