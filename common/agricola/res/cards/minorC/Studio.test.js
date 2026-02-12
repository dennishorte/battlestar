const t = require('../../../testutil_v2.js')

describe('Studio', () => {
  test('convert 1 stone into 3 food during feeding phase', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['studio-c055'],
        stone: 1,
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: feeding phase → Studio offers
    t.choose(game, 'Convert 1 stone into 3 food')

    // food: 0 + 2 (DL) + 3 (Studio) = 5 - 4 (feed) = 1
    // stone: 1 - 1 = 0
    t.testBoard(game, {
      dennis: {
        food: 1,
        grain: 1,  // from Grain Seeds
        minorImprovements: ['studio-c055'],
      },
    })
  })
})
