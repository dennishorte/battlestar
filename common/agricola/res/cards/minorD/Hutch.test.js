const res = require('../../index.js')

describe('Hutch (D043)', () => {
  test('schedules 0, 1, 2, 3 food on next 4 rounds', () => {
    const card = res.getCardById('hutch-d043')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 5 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Round 6: 0 food (not scheduled)
    // Round 7: 1 food
    // Round 8: 2 food
    // Round 9: 3 food
    expect(game.state.scheduledFood.dennis[6]).toBeUndefined()
    expect(game.state.scheduledFood.dennis[7]).toBe(1)
    expect(game.state.scheduledFood.dennis[8]).toBe(2)
    expect(game.state.scheduledFood.dennis[9]).toBe(3)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('hutch-d043')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 12 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Round 13: 0 food (not scheduled)
    // Round 14: 1 food
    // Round 15, 16: beyond game
    expect(game.state.scheduledFood.dennis[13]).toBeUndefined()
    expect(game.state.scheduledFood.dennis[14]).toBe(1)
    expect(game.state.scheduledFood.dennis[15]).toBeUndefined()
  })

  test('has correct properties', () => {
    const card = res.getCardById('hutch-d043')
    expect(card.cost).toEqual({ wood: 1, reed: 1 })
    expect(card.vps).toBe(1)
  })
})
