const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Waterlily Pond (E046)', () => {
  test('schedules food for next 2 rounds', () => {
    const card = res.getCardById('waterlily-pond-e046')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
  })
})
