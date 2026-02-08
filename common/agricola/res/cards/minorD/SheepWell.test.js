const res = require('../../index.js')

describe('Sheep Well (D045)', () => {
  test('schedules food up to number of sheep', () => {
    const card = res.getCardById('sheep-well-d045')
    const player = {
      name: 'dennis',
      getTotalAnimals: (type) => (type === 'sheep' ? 5 : 0),
    }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Should schedule 4 food (rounds 11-14, limited by rounds)
    expect(game.state.scheduledFood.dennis[11]).toBe(1)
    expect(game.state.scheduledFood.dennis[12]).toBe(1)
    expect(game.state.scheduledFood.dennis[13]).toBe(1)
    expect(game.state.scheduledFood.dennis[14]).toBe(1)
  })

  test('limits food scheduling by sheep count', () => {
    const card = res.getCardById('sheep-well-d045')
    const player = {
      name: 'dennis',
      getTotalAnimals: (type) => (type === 'sheep' ? 2 : 0),
    }
    const game = {
      state: { round: 5 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledFood.dennis[6]).toBe(1)
    expect(game.state.scheduledFood.dennis[7]).toBe(1)
    expect(game.state.scheduledFood.dennis[8]).toBeUndefined()
  })

  test('handles zero sheep', () => {
    const card = res.getCardById('sheep-well-d045')
    const player = {
      name: 'dennis',
      getTotalAnimals: () => 0,
    }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledFood).toBeUndefined()
  })

  test('has correct properties', () => {
    const card = res.getCardById('sheep-well-d045')
    expect(card.cost).toEqual({ stone: 2 })
    expect(card.vps).toBe(2)
  })
})
