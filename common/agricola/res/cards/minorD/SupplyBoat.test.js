const t = require('../../../testutil_v2.js')

describe('Supply Boat', () => {
  test('buy 1 grain for 1 food after Fishing', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['supply-boat-d073'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    // Dennis uses Fishing (1 food accumulated in round 2) → Supply Boat triggers
    t.choose(game, 'Fishing')
    t.choose(game, 'Buy 1 grain for 1 food')

    t.testBoard(game, {
      dennis: {
        food: 0,   // 0 + 1 (Fishing) - 1 (Supply Boat) = 0
        grain: 1,  // from Supply Boat
        minorImprovements: ['supply-boat-d073'],
        occupations: ['test-occupation-1'],
      },
    })
  })
})
