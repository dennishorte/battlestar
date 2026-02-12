const t = require('../../../testutil_v2.js')

describe('Small Basket', () => {
  test('pay 1 reed for 1 vegetable after taking reed', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['small-basket-d068'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    // Dennis uses Reed Bank (1 reed accumulated in round 2) → Small Basket triggers
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Pay 1 reed for 1 vegetable')

    t.testBoard(game, {
      dennis: {
        reed: 0,       // 0 + 1 (Reed Bank) - 1 (Small Basket) = 0
        vegetables: 1, // from Small Basket
        minorImprovements: ['small-basket-d068'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })

  test('can skip the offer', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['small-basket-d068'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        reed: 1,  // kept the reed
        minorImprovements: ['small-basket-d068'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })
})
