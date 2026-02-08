const res = require('../../index.js')

describe('Churchyard (D047)', () => {
  test('schedules 2 food per remaining round', () => {
    const card = res.getCardById('churchyard-d047')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledFood.dennis[11]).toBe(2)
    expect(game.state.scheduledFood.dennis[12]).toBe(2)
    expect(game.state.scheduledFood.dennis[13]).toBe(2)
    expect(game.state.scheduledFood.dennis[14]).toBe(2)
  })

  test('schedules for all remaining rounds when played early', () => {
    const card = res.getCardById('churchyard-d047')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 5 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    for (let round = 6; round <= 14; round++) {
      expect(game.state.scheduledFood.dennis[round]).toBe(2)
    }
  })

  test('has correct properties', () => {
    const card = res.getCardById('churchyard-d047')
    expect(card.cost).toEqual({ stone: 1, reed: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ cardsInPlay: 10 })
  })
})
