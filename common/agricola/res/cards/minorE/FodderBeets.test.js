const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Fodder Beets (E044)', () => {
  test('schedules food for odd rounds', () => {
    const card = res.getCardById('fodder-beets-e044')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 4

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    // Should schedule food for rounds 5, 7, 9, 11, 13 (odd rounds after round 4)
    expect(game.state.scheduledFood[dennis.name][5]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][11]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
  })
})
