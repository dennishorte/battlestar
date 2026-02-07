const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Trident (D007)', () => {
  test('gives food based on round played', () => {
    const card = res.getCardById('trident-d007')
    const game = t.fixture({ cardSets: ['minorD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    game.state.round = 6
    card.onPlay(game, dennis)
    expect(dennis.food).toBe(4)

    dennis.food = 0
    game.state.round = 9
    card.onPlay(game, dennis)
    expect(dennis.food).toBe(5)
  })
})
