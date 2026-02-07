const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Working Gloves (E060)', () => {
  test('gives 1 food on play', () => {
    const card = res.getCardById('working-gloves-e060')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
  })
})
