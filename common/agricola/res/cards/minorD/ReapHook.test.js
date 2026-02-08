const res = require('../../index.js')

describe('Reap Hook (D067)', () => {
  test('schedules grain on next 3 of target rounds when played early', () => {
    const card = res.getCardById('reap-hook-d067')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 2 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Target rounds: 4, 7, 9, 11, 13, 14
    // Next 3 after round 2: 4, 7, 9
    expect(game.state.scheduledGrain.dennis[4]).toBe(1)
    expect(game.state.scheduledGrain.dennis[7]).toBe(1)
    expect(game.state.scheduledGrain.dennis[9]).toBe(1)
    expect(game.state.scheduledGrain.dennis[11]).toBeUndefined()
  })

  test('schedules grain on remaining target rounds when played later', () => {
    const card = res.getCardById('reap-hook-d067')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Target rounds: 4, 7, 9, 11, 13, 14
    // Next 3 after round 10: 11, 13, 14
    expect(game.state.scheduledGrain.dennis[11]).toBe(1)
    expect(game.state.scheduledGrain.dennis[13]).toBe(1)
    expect(game.state.scheduledGrain.dennis[14]).toBe(1)
  })

  test('schedules grain on fewer rounds when played very late', () => {
    const card = res.getCardById('reap-hook-d067')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 13 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Only round 14 is left
    expect(game.state.scheduledGrain.dennis[14]).toBe(1)
  })

  test('has correct properties', () => {
    const card = res.getCardById('reap-hook-d067')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
