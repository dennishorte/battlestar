const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cattle Whisperer (C166)', () => {
  test('schedules cattle for rounds 5 and 8 from current round', () => {
    const card = res.getCardById('cattle-whisperer-c166')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 3 }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.state.scheduledCattle).toBeDefined()
    expect(game.state.scheduledCattle[dennis.name][8]).toBe(1) // round 3 + 5
    expect(game.state.scheduledCattle[dennis.name][11]).toBe(1) // round 3 + 8
  })

  test('does not schedule cattle for rounds beyond 14', () => {
    const card = res.getCardById('cattle-whisperer-c166')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 10 }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    // Rounds 15 and 18 are beyond 14, so no cattle scheduled for those
    // scheduledCattle may not have player entry if nothing was scheduled
    const playerSchedule = game.state.scheduledCattle?.[dennis.name]
    expect(playerSchedule?.[15]).toBeUndefined() // round 10 + 5 = 15 (beyond 14)
    expect(playerSchedule?.[18]).toBeUndefined() // round 10 + 8 = 18 (beyond 14)
  })

  test('schedules only valid rounds when played late', () => {
    const card = res.getCardById('cattle-whisperer-c166')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 7 }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.state.scheduledCattle[dennis.name][12]).toBe(1) // round 7 + 5
    expect(game.state.scheduledCattle[dennis.name][15]).toBeUndefined() // round 7 + 8 = 15 (beyond 14)
  })
})
