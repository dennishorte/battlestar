const res = require('../../index.js')

describe('New Market (D055)', () => {
  test('gives 1 food when using round action space in rounds 8-11', () => {
    const card = res.getCardById('new-market-d055')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: { round: 8 },
      isRoundActionSpace: () => true,
      log: { add: jest.fn() },
    }

    card.onAction(game, player, 'some-action')

    expect(player.food).toBe(1)
  })

  test('gives 1 food at round 11', () => {
    const card = res.getCardById('new-market-d055')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: { round: 11 },
      isRoundActionSpace: () => true,
      log: { add: jest.fn() },
    }

    card.onAction(game, player, 'some-action')

    expect(player.food).toBe(1)
  })

  test('does not give food when round is before 8', () => {
    const card = res.getCardById('new-market-d055')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: { round: 7 },
      isRoundActionSpace: () => true,
      log: { add: jest.fn() },
    }

    card.onAction(game, player, 'some-action')

    expect(player.food).toBe(0)
  })

  test('does not give food when round is after 11', () => {
    const card = res.getCardById('new-market-d055')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: { round: 12 },
      isRoundActionSpace: () => true,
      log: { add: jest.fn() },
    }

    card.onAction(game, player, 'some-action')

    expect(player.food).toBe(0)
  })

  test('does not give food for non-round action spaces', () => {
    const card = res.getCardById('new-market-d055')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = {
      state: { round: 9 },
      isRoundActionSpace: () => false,
      log: { add: jest.fn() },
    }

    card.onAction(game, player, 'some-action')

    expect(player.food).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('new-market-d055')
    expect(card.cost).toEqual({ wood: 1, clay: 1 })
    expect(card.vps).toBe(1)
  })
})
