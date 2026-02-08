const res = require('../../index.js')

describe('Bookshelf (D049)', () => {
  test('gives 3 food before playing occupation', () => {
    const card = res.getCardById('bookshelf-d049')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onBeforePlayOccupation(game, player)

    expect(player.food).toBe(3)
  })

  test('has correct properties', () => {
    const card = res.getCardById('bookshelf-d049')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 3 })
  })
})
