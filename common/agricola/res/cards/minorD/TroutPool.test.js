const res = require('../../index.js')

describe('Trout Pool (D054)', () => {
  test('gives 1 food when fishing space has at least 3 food', () => {
    const card = res.getCardById('trout-pool-d054')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: {
        actionSpaces: {
          fishing: { accumulated: 3 },
        },
      },
      log: { add: jest.fn() },
    }

    card.onWorkPhaseStart(game, player)

    expect(player.food).toBe(1)
  })

  test('gives 1 food when fishing space has more than 3 food', () => {
    const card = res.getCardById('trout-pool-d054')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: {
        actionSpaces: {
          fishing: { accumulated: 5 },
        },
      },
      log: { add: jest.fn() },
    }

    card.onWorkPhaseStart(game, player)

    expect(player.food).toBe(1)
  })

  test('does not give food when fishing space has less than 3 food', () => {
    const card = res.getCardById('trout-pool-d054')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: {
        actionSpaces: {
          fishing: { accumulated: 2 },
        },
      },
      log: { add: jest.fn() },
    }

    card.onWorkPhaseStart(game, player)

    expect(player.food).toBe(0)
  })

  test('handles missing fishing space data', () => {
    const card = res.getCardById('trout-pool-d054')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: {
        actionSpaces: {},
      },
      log: { add: jest.fn() },
    }

    card.onWorkPhaseStart(game, player)

    expect(player.food).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('trout-pool-d054')
    expect(card.cost).toEqual({ clay: 2 })
    expect(card.vps).toBe(1)
  })
})
