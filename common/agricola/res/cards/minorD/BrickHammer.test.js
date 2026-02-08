const res = require('../../index.js')

describe('Brick Hammer (D080)', () => {
  test('gives 1 stone when building improvement costing at least 2 clay', () => {
    const card = res.getCardById('brick-hammer-d080')
    const player = {
      stone: 0,
      addResource: function(type, amount) {
        if (type === 'stone') {
          this.stone += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBuildImprovement(game, player, { clay: 2 })

    expect(player.stone).toBe(1)
  })

  test('gives 1 stone when building improvement costing more than 2 clay', () => {
    const card = res.getCardById('brick-hammer-d080')
    const player = {
      stone: 0,
      addResource: function(type, amount) {
        if (type === 'stone') {
          this.stone += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBuildImprovement(game, player, { clay: 5 })

    expect(player.stone).toBe(1)
  })

  test('does not give stone when building improvement costing less than 2 clay', () => {
    const card = res.getCardById('brick-hammer-d080')
    const player = {
      stone: 0,
      addResource: function(type, amount) {
        if (type === 'stone') {
          this.stone += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBuildImprovement(game, player, { clay: 1 })

    expect(player.stone).toBe(0)
  })

  test('does not give stone when building improvement with no clay cost', () => {
    const card = res.getCardById('brick-hammer-d080')
    const player = {
      stone: 0,
      addResource: function(type, amount) {
        if (type === 'stone') {
          this.stone += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBuildImprovement(game, player, { wood: 3 })

    expect(player.stone).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('brick-hammer-d080')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.costAlternative).toEqual({ food: 1 })
  })
})
