const t = require('../../../testutil_v2.js')

describe('Maintenance Premium', () => {
  test('gives 1 food from card when taking wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['maintenance-premium-b055'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    // Play Maintenance Premium (onPlay sets maintenancePremiumFood = 3)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Maintenance Premium')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis takes wood → onAction fires → 1 food from card
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Maintenance Premium
        wood: 3, // from Forest
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['maintenance-premium-b055'],
      },
    })
  })

  test('no food from card when taking non-wood action', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['maintenance-premium-b055'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    // Play Maintenance Premium
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Maintenance Premium')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis takes clay (not wood) → no food from card
    t.choose(game, 'Clay Pit')
    // Micah
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        food: 1, // 1 from Meeting Place only
        clay: 1, // from Clay Pit (1 round accumulation)
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['maintenance-premium-b055'],
      },
    })
  })
})
