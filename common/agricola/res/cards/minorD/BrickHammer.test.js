const t = require('../../../testutil_v2.js')

describe('Brick Hammer', () => {
  test('gives 1 stone when building improvement costing 2+ clay', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['brick-hammer-d080'],
        clay: 2, // for Fireplace (cost: 2 clay)
      },
    })
    game.run()

    // Dennis buys Fireplace (2 clay) → BrickHammer gives 1 stone
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        minorImprovements: ['brick-hammer-d080'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
