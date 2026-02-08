const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wood Collector (C118)', () => {
  test('schedules wood for next 5 rounds', () => {
    const card = res.getCardById('wood-collector-c118')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 3 }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood).toBeDefined()
    expect(game.state.scheduledWood[dennis.name][4]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][5]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
  })

  test('does not schedule wood for rounds beyond 14', () => {
    const card = res.getCardById('wood-collector-c118')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 12 }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.state.scheduledWood[dennis.name][13]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledWood[dennis.name][16]).toBeUndefined()
    expect(game.state.scheduledWood[dennis.name][17]).toBeUndefined()
  })

  test('handles playing in last round', () => {
    const card = res.getCardById('wood-collector-c118')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 14 }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    // All future rounds would be beyond 14, so no wood scheduled
    // scheduledWood may not exist or player entry may not exist
    const playerSchedule = game.state.scheduledWood?.[dennis.name]
    expect(playerSchedule?.[15]).toBeUndefined()
  })
})
