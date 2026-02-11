const t = require('../../../testutil_v2.js')

describe('Forest Stone', () => {
  test('gives 1 food from card when taking wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['forest-stone-b048'],
        occupations: ['test-occupation-1'],
        wood: 2, // card cost
      },
    })
    game.run()

    // Play Forest Stone (onPlay sets forestStoneFood = 2)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Forest Stone')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis takes wood → onAction fires → 1 food from card (forestStoneFood: 2 → 1)
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Forest Stone
        wood: 3, // 2 - 2 (cost) + 3 (Forest)
        occupations: ['test-occupation-1'],
        minorImprovements: ['forest-stone-b048'],
      },
    })
  })

  test('no food from card when taking non-wood/stone action', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['forest-stone-b048'],
        occupations: ['test-occupation-1'],
        wood: 2,
      },
    })
    game.run()

    // Play Forest Stone
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Forest Stone')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis takes clay (not wood/stone) → no food from card
    t.choose(game, 'Clay Pit')
    // Micah
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        food: 1, // 1 from Meeting Place only
        clay: 1, // from Clay Pit
        occupations: ['test-occupation-1'],
        minorImprovements: ['forest-stone-b048'],
      },
    })
  })
})
