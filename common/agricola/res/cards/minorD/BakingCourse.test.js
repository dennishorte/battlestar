const t = require('../../../testutil_v2.js')

describe('Baking Course', () => {
  test('bakes bread on non-harvest round end', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['baking-course-d064'],
        occupations: ['test-occupation-1'],
        grain: 2,
      },
    })
    game.run()

    // Play full round (non-harvest)
    t.choose(game, 'Day Laborer')    // dennis turn 1
    t.choose(game, 'Forest')         // micah turn 1
    t.choose(game, 'Grain Seeds')    // dennis turn 2
    t.choose(game, 'Clay Pit')       // micah turn 2
    // Return home → onRoundEnd → bakeBread prompt
    t.choose(game, 'Bake 1 grain')

    // Round 2 starts
    t.testBoard(game, {
      dennis: {
        food: 4, // 2 (Day Laborer) + 2 (bake 1 grain at rate 2)
        grain: 2, // 2 initial + 1 (Grain Seeds) - 1 (baked)
        occupations: ['test-occupation-1'],
        minorImprovements: ['baking-course-d064'],
      },
    })
  })
})
