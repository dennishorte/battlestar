const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bookmark (E028)', () => {
  test('schedules free occupation 3 rounds later', () => {
    const card = res.getCardById('bookmark-e028')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(game.state.scheduledFreeOccupation[dennis.name]).toContain(8)
  })
})
