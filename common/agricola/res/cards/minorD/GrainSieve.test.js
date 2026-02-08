const res = require('../../index.js')

describe('Grain Sieve (D065)', () => {
  test('gives 1 additional grain when harvesting at least 2 grain', () => {
    const card = res.getCardById('grain-sieve-d065')
    const player = {
      grain: 0,
      addResource: function(type, amount) {
        if (type === 'grain') {
          this.grain += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onHarvestGrain(game, player, 2)

    expect(player.grain).toBe(1)
  })

  test('gives 1 additional grain when harvesting more than 2 grain', () => {
    const card = res.getCardById('grain-sieve-d065')
    const player = {
      grain: 0,
      addResource: function(type, amount) {
        if (type === 'grain') {
          this.grain += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onHarvestGrain(game, player, 5)

    expect(player.grain).toBe(1)
  })

  test('does not give grain when harvesting less than 2 grain', () => {
    const card = res.getCardById('grain-sieve-d065')
    const player = {
      grain: 0,
      addResource: function(type, amount) {
        if (type === 'grain') {
          this.grain += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onHarvestGrain(game, player, 1)

    expect(player.grain).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('grain-sieve-d065')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
