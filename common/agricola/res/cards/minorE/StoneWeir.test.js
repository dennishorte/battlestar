const t = require('../../../testutil_v2.js')

describe('Stone Weir', () => {
  test('gives bonus food inversely proportional to food on fishing space', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stone-weir-e055'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    // Fishing has 1 food (round 1 replenish). Stone Weir bonus: 4-1 = 3
    // Total: 1 (fishing) + 3 (Stone Weir) = 4
    t.choose(game, 'Fishing')      // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        food: 4,
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['stone-weir-e055'],
      },
    })
  })
})
