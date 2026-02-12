const t = require('../../../testutil_v2.js')

describe('Churchyard', () => {
  test('schedules 2 food on each remaining round', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 11,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['churchyard-d047'],
        stone: 1,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Churchyard')

    // Rounds 12-14: 2 food each
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['churchyard-d047'],
        scheduled: {
          food: { 12: 2, 13: 2, 14: 2 },
        },
      },
    })
  })
})
