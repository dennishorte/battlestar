const res = require('../../index.js')

describe('Milking Place (D012)', () => {
  test('gives 1 food during feeding phase', () => {
    const card = res.getCardById('milking-place-d012')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onFeedingPhase(game, player)

    expect(player.food).toBe(1)
  })

  test('prevents holding animals in house', () => {
    const card = res.getCardById('milking-place-d012')
    expect(card.preventsHouseAnimals).toBe(true)
  })

  test('has correct properties', () => {
    const card = res.getCardById('milking-place-d012')
    expect(card.cost).toEqual({ grain: 1 })
    expect(card.vps).toBe(1)
  })
})
