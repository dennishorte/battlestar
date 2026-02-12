const t = require('../../../testutil_v2.js')

describe('Rolling Pin', () => {
  test('gives 1 food on return home if clay > wood', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rolling-pin-d052'],
        occupations: ['test-occupation-1'],
        clay: 5,
        wood: 2,
      },
    })
    game.run()

    // Play full round to reach return home phase
    t.choose(game, 'Day Laborer')    // dennis turn 1
    t.choose(game, 'Forest')         // micah turn 1
    t.choose(game, 'Grain Seeds')    // dennis turn 2
    t.choose(game, 'Clay Pit')       // micah turn 2
    // Return home fires → Rolling Pin gives 1 food (clay 5 > wood 2)

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 (Day Laborer) + 1 (Rolling Pin)
        grain: 1,
        clay: 5,
        wood: 2,
        occupations: ['test-occupation-1'],
        minorImprovements: ['rolling-pin-d052'],
      },
    })
  })

  test('does not give food if clay <= wood', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['rolling-pin-d052'],
        occupations: ['test-occupation-1'],
        clay: 3,
        wood: 3,
      },
    })
    game.run()

    // Play full round
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 2 (Day Laborer) only, no Rolling Pin bonus
        grain: 1,
        clay: 3,
        wood: 3,
        occupations: ['test-occupation-1'],
        minorImprovements: ['rolling-pin-d052'],
      },
    })
  })
})
