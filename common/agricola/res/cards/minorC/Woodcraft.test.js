const t = require('../../../testutil_v2.js')

describe('Woodcraft', () => {
  test('gives 1 food after wood action if ≤5 wood', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['woodcraft-c058'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    t.choose(game, 'Forest')       // dennis: 3 wood, ≤5 → +1 food
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        wood: 3,
        food: 1,
        grain: 1,
        occupations: ['test-occupation-1'],
        minorImprovements: ['woodcraft-c058'],
      },
    })
  })

  test('no food if >5 wood after taking', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['woodcraft-c058'],
        occupations: ['test-occupation-1'],
        wood: 4,
      },
    })
    game.run()

    t.choose(game, 'Forest')       // dennis: 4+3=7 wood, >5 → no food
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        wood: 7,
        grain: 1,
        occupations: ['test-occupation-1'],
        minorImprovements: ['woodcraft-c058'],
      },
    })
  })
})
