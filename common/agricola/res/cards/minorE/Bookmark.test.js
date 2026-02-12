const t = require('../../../testutil_v2.js')

describe('Bookmark', () => {
  test('schedules free occupation event on round current+3', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bookmark-e028'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bookmark')

    // Round 5 + 3 = 8
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['bookmark-e028'],
        scheduled: {
          freeOccupation: [8],
        },
      },
    })
  })
})
