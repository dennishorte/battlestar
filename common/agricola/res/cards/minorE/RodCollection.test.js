const t = require('../../../testutil_v2.js')

describe('Rod Collection', () => {
  test('store 2 wood after Fishing', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rod-collection-e038'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Store 2 wood on Rod Collection')

    // Stored 2 wood: 1st excluded, 2nd scores = 1 bonus point + 1 vps = 2 from card
    // Score: categories(-7) + rooms(0) + family(6) + unused(-13) + bonus(2) = -12
    t.testBoard(game, {
      dennis: {
        food: 1,  // Fishing accumulates 1 in round 2
        wood: 0,  // 2 - 2 = 0
        minorImprovements: ['rod-collection-e038'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        score: -12,
      },
    })
  })

  test('skip storing wood', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rod-collection-e038'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 1,
        wood: 1,  // unchanged
        minorImprovements: ['rod-collection-e038'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
  })
})
