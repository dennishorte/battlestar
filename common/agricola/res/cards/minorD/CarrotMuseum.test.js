const res = require('../../index.js')

describe('Carrot Museum (D079)', () => {
  test('gives stone for vegetable fields at round 8', () => {
    const card = res.getCardById('carrot-museum-d079')
    const player = {
      stone: 0,
      wood: 0,
      vegetables: 0,
      getVegetableFieldCount: () => 3,
      addResource: function(type, amount) {
        this[type] += amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRoundEnd(game, player, 8)

    expect(player.stone).toBe(3)
  })

  test('gives wood for vegetables in supply at round 10', () => {
    const card = res.getCardById('carrot-museum-d079')
    const player = {
      stone: 0,
      wood: 0,
      vegetables: 4,
      getVegetableFieldCount: () => 0,
      addResource: function(type, amount) {
        this[type] += amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRoundEnd(game, player, 10)

    expect(player.wood).toBe(4)
  })

  test('gives both stone and wood at round 12', () => {
    const card = res.getCardById('carrot-museum-d079')
    const player = {
      stone: 0,
      wood: 0,
      vegetables: 2,
      getVegetableFieldCount: () => 2,
      addResource: function(type, amount) {
        this[type] += amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRoundEnd(game, player, 12)

    expect(player.stone).toBe(2)
    expect(player.wood).toBe(2)
  })

  test('does not trigger at non-target rounds', () => {
    const card = res.getCardById('carrot-museum-d079')
    const player = {
      stone: 0,
      wood: 0,
      vegetables: 5,
      getVegetableFieldCount: () => 5,
      addResource: function(type, amount) {
        this[type] += amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRoundEnd(game, player, 7)

    expect(player.stone).toBe(0)
    expect(player.wood).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('carrot-museum-d079')
    expect(card.cost).toEqual({ wood: 1, clay: 2 })
    expect(card.vps).toBe(2)
    expect(card.prereqs).toEqual({ maxRound: 8 })
  })
})
