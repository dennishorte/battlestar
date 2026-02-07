const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stew (C045)', () => {
  test('schedules 4 food on Day Laborer action', () => {
    const card = res.getCardById('stew-c045')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onAction(game, dennis, 'day-laborer')

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
  })
})
