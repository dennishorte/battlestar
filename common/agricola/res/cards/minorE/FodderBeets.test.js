const t = require('../../../testutil_v2.js')

describe('Fodder Beets', () => {
  test('schedules 1 food on remaining odd-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['fodder-beets-e044'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Fodder Beets')

    // Odd rounds after 6: 7, 9, 11, 13
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['fodder-beets-e044'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
        },
        scheduled: {
          food: { 7: 1, 9: 1, 11: 1, 13: 1 },
        },
      },
    })
  })
})
