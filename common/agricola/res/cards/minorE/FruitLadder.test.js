const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Fruit Ladder (E045)', () => {
  test('schedules food for even rounds', () => {
    const card = res.getCardById('fruit-ladder-e045')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    // Should schedule food for rounds 4, 6, 8, 10, 12, 14 (even rounds after round 3)
    expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][10]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][12]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
  })
})
