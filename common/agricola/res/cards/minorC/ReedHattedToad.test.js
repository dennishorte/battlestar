const t = require('../../../testutil_v2.js')

describe('Reed-Hatted Toad', () => {
  test('schedules reed at offsets +5,+7,+9,+11,+13', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reed-hatted-toad-c078'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Reed-Hatted Toad')

    // Round 1 + offsets: 6, 8, 10, 12, 14
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // +1 MP, -1 cost
        minorImprovements: ['reed-hatted-toad-c078'],
        scheduled: {
          reed: { 6: 1, 8: 1, 10: 1, 12: 1, 14: 1 },
        },
      },
    })
  })
})
