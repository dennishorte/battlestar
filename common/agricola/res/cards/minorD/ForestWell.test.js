const res = require('../../index.js')

describe('Forest Well (D044)', () => {
  test('schedules food up to amount of wood in supply', () => {
    const card = res.getCardById('forest-well-d044')
    const player = { name: 'dennis', wood: 5 }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Should schedule food for rounds 11-14 (4 rounds, limited by remaining rounds)
    expect(game.state.scheduledFood.dennis[11]).toBe(1)
    expect(game.state.scheduledFood.dennis[12]).toBe(1)
    expect(game.state.scheduledFood.dennis[13]).toBe(1)
    expect(game.state.scheduledFood.dennis[14]).toBe(1)
  })

  test('limits food scheduling by wood amount', () => {
    const card = res.getCardById('forest-well-d044')
    const player = { name: 'dennis', wood: 2 }
    const game = {
      state: { round: 5 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledFood.dennis[6]).toBe(1)
    expect(game.state.scheduledFood.dennis[7]).toBe(1)
    expect(game.state.scheduledFood.dennis[8]).toBeUndefined()
  })

  test('handles zero wood', () => {
    const card = res.getCardById('forest-well-d044')
    const player = { name: 'dennis', wood: 0 }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledFood).toBeUndefined()
  })

  test('has correct properties', () => {
    const card = res.getCardById('forest-well-d044')
    expect(card.cost).toEqual({ stone: 1, food: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 2 })
  })
})
