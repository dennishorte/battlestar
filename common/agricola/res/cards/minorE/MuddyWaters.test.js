const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Muddy Waters (E041)', () => {
  test('schedules alternating food and clay for even rounds', () => {
    const card = res.getCardById('muddy-waters-e041')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    // Even rounds after 3: 4, 6, 8, 10, 12, 14
    // Alternating starting with food: food(4), clay(6), food(8), clay(10), food(12), clay(14)
    expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
    expect(game.state.scheduledClay[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledClay[dennis.name][10]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][12]).toBe(1)
    expect(game.state.scheduledClay[dennis.name][14]).toBe(1)
  })

  test('does not schedule odd rounds', () => {
    const card = res.getCardById('muddy-waters-e041')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 2

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][3]).toBeUndefined()
    expect(game.state.scheduledFood[dennis.name][5]).toBeUndefined()
  })
})
