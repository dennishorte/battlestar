const res = require('../../index.js')

describe('Reed Pond (D078)', () => {
  test('schedules 1 reed on each of next 3 rounds', () => {
    const card = res.getCardById('reed-pond-d078')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 5 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledReed.dennis[6]).toBe(1)
    expect(game.state.scheduledReed.dennis[7]).toBe(1)
    expect(game.state.scheduledReed.dennis[8]).toBe(1)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('reed-pond-d078')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 12 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    expect(game.state.scheduledReed.dennis[13]).toBe(1)
    expect(game.state.scheduledReed.dennis[14]).toBe(1)
    expect(game.state.scheduledReed.dennis[15]).toBeUndefined()
  })

  test('has correct properties', () => {
    const card = res.getCardById('reed-pond-d078')
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ occupations: 3 })
  })
})
