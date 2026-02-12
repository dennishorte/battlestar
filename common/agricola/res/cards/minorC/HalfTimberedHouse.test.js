const t = require('../../../testutil_v2.js')

describe('Half-Timbered House', () => {
  test('scores 3 VP for 3 stone rooms', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['half-timbered-house-c030'],
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -4,
        roomType: 'stone',
        minorImprovements: ['half-timbered-house-c030'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('scores 0 if not stone house', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['half-timbered-house-c030'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14,
        minorImprovements: ['half-timbered-house-c030'],
      },
    })
  })
})
