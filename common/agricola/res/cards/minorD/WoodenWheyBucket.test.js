const t = require('../../../testutil_v2.js')

describe('Wooden Whey Bucket', () => {
  test('build stable for 1 wood before Sheep Market', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market'],
      dennis: {
        wood: 1,
        minorImprovements: ['wooden-whey-bucket-d016'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')
    // onBeforeAction fires → Wooden Whey Bucket
    t.choose(game, 'Build 1 stable (1 wood)')
    t.choose(game, '1,3')           // stable location
    // Sheep Market executes (1 sheep) — auto-placed in pasture

    t.testBoard(game, {
      dennis: {
        // wood: 0 (1 - 1 for stable)
        animals: { sheep: 1 },
        minorImprovements: ['wooden-whey-bucket-d016'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 1 }],
          stables: [{ row: 1, col: 3 }],
        },
      },
    })
  })

  test('skip stable building', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market'],
      dennis: {
        wood: 1,
        minorImprovements: ['wooden-whey-bucket-d016'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')
    t.choose(game, 'Skip')
    // 1 sheep auto-placed in pasture

    t.testBoard(game, {
      dennis: {
        wood: 1,
        animals: { sheep: 1 },
        minorImprovements: ['wooden-whey-bucket-d016'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})
