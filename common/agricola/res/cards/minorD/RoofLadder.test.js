const res = require('../../index.js')

describe('Roof Ladder (D081)', () => {
  test('modifies renovation cost by reducing 1 reed', () => {
    const card = res.getCardById('roof-ladder-d081')
    const player = {}
    const cost = { reed: 3, stone: 5 }

    const newCost = card.modifyRenovationCost(player, cost)

    expect(newCost.reed).toBe(2)
    expect(newCost.stone).toBe(5)
  })

  test('does not reduce reed below 0', () => {
    const card = res.getCardById('roof-ladder-d081')
    const player = {}
    const cost = { reed: 0, stone: 5 }

    const newCost = card.modifyRenovationCost(player, cost)

    expect(newCost.reed).toBe(0)
  })

  test('gives 1 stone on renovate', () => {
    const card = res.getCardById('roof-ladder-d081')
    const player = {
      stone: 0,
      addResource: function(type, amount) {
        if (type === 'stone') {
          this.stone += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onRenovate(game, player)

    expect(player.stone).toBe(1)
  })

  test('has correct properties', () => {
    const card = res.getCardById('roof-ladder-d081')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
