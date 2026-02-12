const t = require('../../../testutil_v2.js')

describe('Barn Cats', () => {
  test('schedules food based on stable count (2 stables = 3 rounds)', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['barn-cats-e043'],
        farmyard: {
          stables: [{ row: 0, col: 4 }, { row: 1, col: 4 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Barn Cats')

    // 2 stables → min(2+1, 5) = 3 rounds of food
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['barn-cats-e043'],
        farmyard: {
          stables: [{ row: 0, col: 4 }, { row: 1, col: 4 }],
        },
        scheduled: {
          food: { 9: 1, 10: 1, 11: 1 },
        },
      },
    })
  })
})
