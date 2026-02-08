const res = require('../../index.js')

describe('Lynchet (D063)', () => {
  test('gives food for harvested fields adjacent to house', () => {
    const card = res.getCardById('lynchet-d063')
    const player = {
      food: 0,
      getHarvestedFieldsAdjacentToHouse: () => 3,
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

  test('gives no food when no harvested fields adjacent to house', () => {
    const card = res.getCardById('lynchet-d063')
    const player = {
      food: 0,
      getHarvestedFieldsAdjacentToHouse: () => 0,
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

  test('has correct properties', () => {
    const card = res.getCardById('lynchet-d063')
    expect(card.cost).toEqual({})
  })
})
