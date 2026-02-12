const t = require('../../../testutil_v2.js')

describe('Luxurious Hostel', () => {
  test('scores 4 VP when stone rooms > family members', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['luxurious-hostel-d034'],
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // 3 stone rooms > 2 family → 4 VP
    t.testBoard(game, {
      dennis: {
        score: -3,
        roomType: 'stone',
        minorImprovements: ['luxurious-hostel-d034'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('scores 0 VP when rooms equal family members', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['luxurious-hostel-d034'],
        roomType: 'stone',
      },
    })
    game.run()

    // 2 stone rooms = 2 family → 0 VP
    t.testBoard(game, {
      dennis: {
        score: -10,
        roomType: 'stone',
        minorImprovements: ['luxurious-hostel-d034'],
      },
    })
  })
})
