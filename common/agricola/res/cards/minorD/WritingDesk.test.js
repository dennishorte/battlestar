const t = require('../../../testutil_v2.js')

describe('Writing Desk', () => {
  test('play additional occupation for 2 food on Lessons', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        hand: ['test-occupation-3', 'test-occupation-4'],
        minorImprovements: ['writing-desk-d028'],
        food: 4,
      },
    })
    game.run()

    // Dennis takes Lessons A → plays occupation (3rd occ costs 1 food)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 3')
    // Writing Desk triggers: play additional occupation for 2 food
    t.choose(game, 'Play 1 additional occupation for 2 food')
    t.choose(game, 'Test Occupation 4')

    t.testBoard(game, {
      dennis: {
        food: 1,  // 4 - 1 (3rd occ) - 2 (Writing Desk) = 1
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
        minorImprovements: ['writing-desk-d028'],
      },
    })
  })
})
