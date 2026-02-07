const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Farmyard Manure (A043)', () => {
  test('schedules food on next 3 round spaces on stable build', () => {
    const card = res.getCardById('farmyard-manure-a043')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onBuildStable(game, dennis)

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })

  test('does not schedule food past round 14', () => {
    const card = res.getCardById('farmyard-manure-a043')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13

    card.onBuildStable(game, dennis)

    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledFood[dennis.name][16]).toBeUndefined()
  })
})
