const res = require('../../index.js')

describe('Civic Facade (D048)', () => {
  test('gives 1 food when more occupations than improvements in hand', () => {
    const card = res.getCardById('civic-facade-d048')
    const player = {
      food: 0,
      getOccupationsInHand: () => [1, 2, 3],
      getImprovementsInHand: () => [1, 2],
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRoundStart(game, player)

    expect(player.food).toBe(1)
  })

  test('does not give food when equal occupations and improvements in hand', () => {
    const card = res.getCardById('civic-facade-d048')
    const player = {
      food: 0,
      getOccupationsInHand: () => [1, 2],
      getImprovementsInHand: () => [1, 2],
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRoundStart(game, player)

    expect(player.food).toBe(0)
  })

  test('does not give food when fewer occupations than improvements in hand', () => {
    const card = res.getCardById('civic-facade-d048')
    const player = {
      food: 0,
      getOccupationsInHand: () => [1],
      getImprovementsInHand: () => [1, 2, 3],
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRoundStart(game, player)

    expect(player.food).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('civic-facade-d048')
    expect(card.cost).toEqual({ clay: 1 })
    expect(card.prereqs).toEqual({ rooms: 3 })
  })
})
