const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Layabout (C108)', () => {
  test('sets skip next harvest flag on play', () => {
    const card = res.getCardById('layabout-c108')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.skipNextHarvest = false
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.skipNextHarvest).toBe(true)
  })
})
