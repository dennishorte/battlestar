const res = require('../../index.js')

describe('Cesspit (D040)', () => {
  test('schedules alternating clay and boar on remaining rounds', () => {
    const card = res.getCardById('cesspit-d040')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Rounds 11, 12, 13, 14 should have alternating clay and boar
    expect(game.state.scheduledClay.dennis[11]).toBe(1) // clay
    expect(game.state.scheduledBoar.dennis[12]).toBe(1) // boar
    expect(game.state.scheduledClay.dennis[13]).toBe(1) // clay
    expect(game.state.scheduledBoar.dennis[14]).toBe(1) // boar
  })

  test('starts with clay on first scheduled round', () => {
    const card = res.getCardById('cesspit-d040')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 5 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledClay.dennis[6]).toBe(1)
    expect(game.state.scheduledBoar.dennis[7]).toBe(1)
    expect(game.state.scheduledClay.dennis[8]).toBe(1)
    expect(game.state.scheduledBoar.dennis[9]).toBe(1)
  })

  test('has correct properties', () => {
    const card = res.getCardById('cesspit-d040')
    expect(card.cost).toEqual({})
    expect(card.vps).toBe(-1)
    expect(card.prereqs).toEqual({ fields: 2, occupations: 1 })
  })
})
