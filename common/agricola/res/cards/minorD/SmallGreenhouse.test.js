const res = require('../../index.js')

describe('Small Greenhouse (D069)', () => {
  test('schedules purchasable vegetables on rounds +4 and +7', () => {
    const card = res.getCardById('small-greenhouse-d069')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 3 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Rounds 3+4=7 and 3+7=10
    expect(game.state.scheduledVegetablesPurchase.dennis[7]).toBe(1)
    expect(game.state.scheduledVegetablesPurchase.dennis[10]).toBe(1)
  })

  test('does not schedule vegetables beyond round 14', () => {
    const card = res.getCardById('small-greenhouse-d069')
    const player = { name: 'dennis' }
    const game = {
      state: { round: 10 },
      log: { add: jest.fn() },
    }

    card.onPlay(game, player)

    // Round 10+4=14 (valid), 10+7=17 (invalid)
    expect(game.state.scheduledVegetablesPurchase.dennis[14]).toBe(1)
    expect(game.state.scheduledVegetablesPurchase.dennis[17]).toBeUndefined()
  })

  test('has correct properties', () => {
    const card = res.getCardById('small-greenhouse-d069')
    expect(card.cost).toEqual({ wood: 2 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 1 })
  })
})
