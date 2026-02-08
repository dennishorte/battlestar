const res = require('../../index.js')

describe('Wholesale Market (D057)', () => {
  test('schedules 1 food per remaining round', () => {
    const card = res.getCardById('wholesale-market-d057')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledFood.dennis[11]).toBe(1)
    expect(game.state.scheduledFood.dennis[12]).toBe(1)
    expect(game.state.scheduledFood.dennis[13]).toBe(1)
    expect(game.state.scheduledFood.dennis[14]).toBe(1)
  })

  test('schedules for all remaining rounds when played early', () => {
    const card = res.getCardById('wholesale-market-d057')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 3 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    for (let round = 4; round <= 14; round++) {
      expect(game.state.scheduledFood.dennis[round]).toBe(1)
    }
  })

  test('has correct properties', () => {
    const card = res.getCardById('wholesale-market-d057')
    expect(card.cost).toEqual({ wood: 2, vegetables: 2 })
    expect(card.vps).toBe(3)
  })
})
