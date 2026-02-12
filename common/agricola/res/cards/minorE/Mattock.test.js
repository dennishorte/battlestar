const t = require('../../../testutil_v2.js')

describe('Mattock', () => {
  test('gives 1 clay when getting reed from action space', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mattock-e077'],
      },
    })
    game.run()

    // Reed Bank accumulates 1 reed. Mattock: reed > 0 → +1 clay
    t.choose(game, 'Reed Bank')    // dennis: 1 reed + 1 clay (Mattock)
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        reed: 1,
        clay: 1,
        grain: 1,
        minorImprovements: ['mattock-e077'],
      },
    })
  })

  test('no clay when action gives neither reed nor stone', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mattock-e077'],
      },
    })
    game.run()

    // Forest gives wood only — Mattock does not trigger
    t.choose(game, 'Forest')       // dennis: 3 wood, no clay
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        wood: 3,
        grain: 1,
        minorImprovements: ['mattock-e077'],
      },
    })
  })
})
