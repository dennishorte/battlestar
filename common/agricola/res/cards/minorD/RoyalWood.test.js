const res = require('../../index.js')

describe('Royal Wood (D074)', () => {
  test('gives back half of wood paid when building improvement', () => {
    const card = res.getCardById('royal-wood-d074')
    const player = {
      wood: 0,
      addResource: function(type, amount) {
        if (type === 'wood') {
          this.wood += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBuildImprovement(game, player, 4)

    expect(player.wood).toBe(2)
  })

  test('rounds down wood returned', () => {
    const card = res.getCardById('royal-wood-d074')
    const player = {
      wood: 0,
      addResource: function(type, amount) {
        if (type === 'wood') {
          this.wood += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBuildImprovement(game, player, 5)

    expect(player.wood).toBe(2)
  })

  test('gives 0 wood when less than 2 wood paid', () => {
    const card = res.getCardById('royal-wood-d074')
    const player = {
      wood: 0,
      addResource: function(type, amount) {
        if (type === 'wood') {
          this.wood += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBuildImprovement(game, player, 1)

    expect(player.wood).toBe(0)
  })

  test('gives back half of wood paid on farm expansion', () => {
    const card = res.getCardById('royal-wood-d074')
    const player = {
      wood: 0,
      addResource: function(type, amount) {
        if (type === 'wood') {
          this.wood += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onFarmExpansion(game, player, 6)

    expect(player.wood).toBe(3)
  })

  test('has correct properties', () => {
    const card = res.getCardById('royal-wood-d074')
    expect(card.cost).toEqual({ food: 1 })
  })
})
