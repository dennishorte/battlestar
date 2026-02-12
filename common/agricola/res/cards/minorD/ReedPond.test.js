const t = require('../../../testutil_v2.js')

describe('Reed Pond', () => {
  test('schedules 1 reed on each of next 3 rounds', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reed-pond-d078'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Reed Pond')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['reed-pond-d078'],
        scheduled: {
          reed: { 6: 1, 7: 1, 8: 1 },
        },
      },
    })
  })
})
