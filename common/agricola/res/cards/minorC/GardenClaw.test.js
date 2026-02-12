const t = require('../../../testutil_v2.js')

describe('Garden Claw', () => {
  test('schedules food based on planted fields count', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['garden-claw-c047'],
        wood: 1,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Garden Claw')

    // 2 planted fields × 3 = 6 rounds max, rounds 9-14 = 6 rounds available
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['garden-claw-c047'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
        scheduled: {
          food: { 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 },
        },
      },
    })
  })
})
