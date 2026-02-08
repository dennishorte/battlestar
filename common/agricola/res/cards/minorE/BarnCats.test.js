const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Barn Cats (E043)', () => {
  test('schedules food for next rounds based on stable count', () => {
    const card = res.getCardById('barn-cats-e043')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.getStableCount = () => 2

    card.onPlay(game, dennis)

    // 2 stables = 3 rounds of food (rounds 6, 7, 8)
    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][9]).toBeUndefined()
  })

  test('schedules up to 5 rounds with 4+ stables', () => {
    const card = res.getCardById('barn-cats-e043')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 3

    const dennis = t.player(game)
    dennis.getStableCount = () => 4

    card.onPlay(game, dennis)

    // 4 stables = 5 rounds of food (rounds 4-8)
    expect(game.state.scheduledFood[dennis.name][4]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][5]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })

  test('does not schedule food beyond round 14', () => {
    const card = res.getCardById('barn-cats-e043')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()
    game.state.round = 12

    const dennis = t.player(game)
    dennis.getStableCount = () => 4

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
  })
})
