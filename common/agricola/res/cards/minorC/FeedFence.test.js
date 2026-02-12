const t = require('../../../testutil_v2.js')

describe('Feed Fence', () => {
  test('gives 1 food when building a stable', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feed-fence-c056'],
        wood: 2, // 2 for 1 stable
      },
    })
    game.run()

    // Dennis builds 1 stable via Farm Expansion → Feed Fence gives 1 food
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    t.testBoard(game, {
      dennis: {
        wood: 0,
        food: 1,
        minorImprovements: ['feed-fence-c056'],
        farmyard: {
          stables: [{ row: 1, col: 1 }],
        },
      },
    })
  })
})
