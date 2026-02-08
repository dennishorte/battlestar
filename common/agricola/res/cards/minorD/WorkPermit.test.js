const res = require('../../index.js')

describe('Work Permit (D022)', () => {
  test('schedules person on target round based on building resources', () => {
    const card = res.getCardById('work-permit-d022')
    const scheduleWorkPermitPersonCalled = []
    const game = {
      state: { round: 5 },
      actions: {
        scheduleWorkPermitPerson: (player, cardArg, targetRound) => {
          scheduleWorkPermitPersonCalled.push({ player, card: cardArg, targetRound })
        },
      },
    }
    const player = {
      wood: 2,
      clay: 1,
      reed: 1,
      stone: 1,
      hasPersonInSupply: () => true,
    }

    card.onPlay(game, player)

    expect(scheduleWorkPermitPersonCalled).toHaveLength(1)
    // Round 5 + 5 building resources = round 10
    expect(scheduleWorkPermitPersonCalled[0].targetRound).toBe(10)
  })

  test('does not schedule when target round exceeds 14', () => {
    const card = res.getCardById('work-permit-d022')
    const scheduleWorkPermitPersonCalled = []
    const game = {
      state: { round: 10 },
      actions: {
        scheduleWorkPermitPerson: (player, cardArg, targetRound) => {
          scheduleWorkPermitPersonCalled.push({ player, card: cardArg, targetRound })
        },
      },
    }
    const player = {
      wood: 3,
      clay: 3,
      reed: 3,
      stone: 3,
      hasPersonInSupply: () => true,
    }

    card.onPlay(game, player)

    expect(scheduleWorkPermitPersonCalled).toHaveLength(0)
  })

  test('does not schedule when no person in supply', () => {
    const card = res.getCardById('work-permit-d022')
    const scheduleWorkPermitPersonCalled = []
    const game = {
      state: { round: 5 },
      actions: {
        scheduleWorkPermitPerson: (player, cardArg, targetRound) => {
          scheduleWorkPermitPersonCalled.push({ player, card: cardArg, targetRound })
        },
      },
    }
    const player = {
      wood: 2,
      clay: 1,
      reed: 1,
      stone: 1,
      hasPersonInSupply: () => false,
    }

    card.onPlay(game, player)

    expect(scheduleWorkPermitPersonCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('work-permit-d022')
    expect(card.cost).toEqual({ food: 1 })
    expect(card.prereqs).toEqual({ buildingResourcesInSupply: 1 })
  })
})
