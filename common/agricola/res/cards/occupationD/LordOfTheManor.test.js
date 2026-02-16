const t = require('../../../testutil_v2.js')

describe('Lord of the Manor', () => {
  test('scores bonus VP for categories at max', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['lord-of-the-manor-d100'],
        grain: 8,      // max score in grain category (4 pts)
        vegetables: 4,  // max score in vegetables category (4 pts)
      },
    })
    game.run()

    // Score calculation:
    // fields: 0 = -1
    // pastures: 0 = -1
    // grain: 8+ = 4
    // vegetables: 4+ = 4
    // sheep: 0 = -1, boar: 0 = -1, cattle: 0 = -1
    // Categories subtotal = 3
    // Rooms: 2 wood = 0
    // Family: 2 * 3 = 6
    // Unused spaces: 13 * -1 = -13
    // Lord of the Manor: 2 categories at max (grain, vegetables) = 2 bonus pts
    // Total = 3 + 0 + 6 - 13 + 2 = -2
    t.testBoard(game, {
      dennis: {
        score: -2,
        grain: 8,
        vegetables: 4,
        occupations: ['lord-of-the-manor-d100'],
      },
    })
  })

  test('scores 0 bonus VP when no categories at max', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['lord-of-the-manor-d100'],
      },
    })
    game.run()

    // Score calculation:
    // All 7 categories at 0 = 7 * -1 = -7
    // Rooms: 2 wood = 0
    // Family: 2 * 3 = 6
    // Unused spaces: 13 * -1 = -13
    // Lord of the Manor: 0 categories at max = 0 bonus
    // Total = -7 + 0 + 6 - 13 + 0 = -14
    t.testBoard(game, {
      dennis: {
        score: -14,
        occupations: ['lord-of-the-manor-d100'],
      },
    })
  })
})
