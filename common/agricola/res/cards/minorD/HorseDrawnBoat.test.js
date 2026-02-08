const res = require('../../index.js')

describe('Horse-Drawn Boat (D041)', () => {
  test('schedules alternating food and sheep on remaining rounds', () => {
    const card = res.getCardById('horse-drawn-boat-d041')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Rounds 11, 12, 13, 14 should have alternating food and sheep
    expect(game.state.scheduledFood.dennis[11]).toBe(1) // food
    expect(game.state.scheduledSheep.dennis[12]).toBe(1) // sheep
    expect(game.state.scheduledFood.dennis[13]).toBe(1) // food
    expect(game.state.scheduledSheep.dennis[14]).toBe(1) // sheep
  })

  test('starts with food on first scheduled round', () => {
    const card = res.getCardById('horse-drawn-boat-d041')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 5 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledFood.dennis[6]).toBe(1)
    expect(game.state.scheduledSheep.dennis[7]).toBe(1)
    expect(game.state.scheduledFood.dennis[8]).toBe(1)
    expect(game.state.scheduledSheep.dennis[9]).toBe(1)
  })

  test('has correct properties', () => {
    const card = res.getCardById('horse-drawn-boat-d041')
    expect(card.cost).toEqual({ wood: 2 })
    expect(card.prereqs).toEqual({ occupations: 3 })
  })
})
