const t = require('../../../testutil_v2.js')

describe('Blade Shears', () => {
  test('choose 1 food per sheep when more than 3 sheep', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['blade-shears-c007'],
        wood: 1,  // card cost
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 4 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Blade Shears')
    t.choose(game, 'Get 4 food (1 per sheep)')

    t.testBoard(game, {
      dennis: {
        food: 5,  // 1 (Meeting Place) + 4 (sheep)
        animals: { sheep: 4 },
        minorImprovements: ['blade-shears-c007'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 4 }],
        },
      },
    })
  })

  test('auto-picks 3 food when 3 or fewer sheep', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['blade-shears-c007'],
        wood: 1,  // card cost
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }], sheep: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Blade Shears')
    // No choice prompt — sheep food (2) <= 3, auto-picks 3 food

    t.testBoard(game, {
      dennis: {
        food: 4,  // 1 (Meeting Place) + 3 (Blade Shears)
        animals: { sheep: 2 },
        minorImprovements: ['blade-shears-c007'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }], sheep: 2 }],
        },
      },
    })
  })
})
