const t = require('../../../testutil_v2.js')

describe('Writing Boards', () => {
  test('gives 1 wood per played occupation', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['writing-boards-c004'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Writing Boards')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        food: 1, // 1 food start, +1 Meeting Place, -1 card cost
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['writing-boards-c004'],
      },
    })
  })
})
