const t = require('../../../testutil_v2.js')

describe('Beer Tap', () => {
  test('convert grain into food during feeding phase', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beer-tap-d062'],
        grain: 3,
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain → 4 grain
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: feeding phase → BeerTap offers (4 grain available: all tiers)
    t.choose(game, 'Convert 3 grain into 6 food')

    // food: 0 + 2 (DL) + 6 (BeerTap) = 8 - 4 (feed) = 4
    // grain: 3 + 1 (GS) - 3 (BeerTap) = 1
    t.testBoard(game, {
      dennis: {
        food: 4,
        grain: 1,
        minorImprovements: ['beer-tap-d062'],
      },
    })
  })
})
