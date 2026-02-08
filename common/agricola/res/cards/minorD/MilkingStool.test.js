const res = require('../../index.js')

describe('Milking Stool (D038)', () => {
  test('gives 1 food during harvest with at least 1 cattle', () => {
    const card = res.getCardById('milking-stool-d038')
    const player = {
      food: 0,
      getTotalAnimals: (type) => (type === 'cattle' ? 1 : 0),
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onHarvest(game, player)

    expect(player.food).toBe(1)
  })

  test('gives 2 food during harvest with at least 3 cattle', () => {
    const card = res.getCardById('milking-stool-d038')
    const player = {
      food: 0,
      getTotalAnimals: (type) => (type === 'cattle' ? 3 : 0),
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onHarvest(game, player)

    expect(player.food).toBe(2)
  })

  test('gives 3 food during harvest with at least 5 cattle', () => {
    const card = res.getCardById('milking-stool-d038')
    const player = {
      food: 0,
      getTotalAnimals: (type) => (type === 'cattle' ? 5 : 0),
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onHarvest(game, player)

    expect(player.food).toBe(3)
  })

  test('gives 0 food during harvest with no cattle', () => {
    const card = res.getCardById('milking-stool-d038')
    const player = {
      food: 0,
      getTotalAnimals: () => 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onHarvest(game, player)

    expect(player.food).toBe(0)
  })

  test('gives 1 bonus point per 2 cattle at end of game', () => {
    const card = res.getCardById('milking-stool-d038')
    expect(card.getEndGamePoints({ getTotalAnimals: () => 4 })).toBe(2)
    expect(card.getEndGamePoints({ getTotalAnimals: () => 5 })).toBe(2)
    expect(card.getEndGamePoints({ getTotalAnimals: () => 6 })).toBe(3)
  })

  test('has correct properties', () => {
    const card = res.getCardById('milking-stool-d038')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.prereqs).toEqual({ occupations: 2 })
  })
})
