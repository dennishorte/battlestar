const t = require('../../../testutil.js')

describe('Big Country (A033)', () => {
  test('gives bonus points and food based on rounds left', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    // Fill all farmyard spaces to meet prereq
    const fields = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        if (row === 0 && col === 0) {
          continue
        }
        if (row === 1 && col === 0) {
          continue
        }
        fields.push({ row, col })
      }
    }
    t.setBoard(game, {
      dennis: {
        food: 0,
        hand: ['big-country-a033'],
        farmyard: { fields },
      },
      round: 10,
    })
    game.run()

    game.state.round = 10
    t.playCard(game, 'dennis', 'big-country-a033')

    const dennis = t.player(game)
    // 14 - 10 = 4 rounds left
    expect(dennis.bonusPoints).toBe(4)
    expect(dennis.food).toBe(8) // 4 rounds * 2 food
  })
})
