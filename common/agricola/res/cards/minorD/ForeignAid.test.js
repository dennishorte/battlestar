const res = require('../../index.js')

describe('Foreign Aid (D050)', () => {
  test('gives 6 food and sets restriction on play', () => {
    const card = res.getCardById('foreign-aid-d050')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlay(game, player)

    expect(player.food).toBe(6)
    expect(player.foreignAidRestriction).toBe(true)
  })

  test('has correct properties', () => {
    const card = res.getCardById('foreign-aid-d050')
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ maxRound: 11 })
  })
})
