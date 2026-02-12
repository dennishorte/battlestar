const t = require('../../../testutil_v2.js')

describe('Farm Store', () => {
  test('exchange 1 food for 2 building resources after feeding', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['farm-store-c041'],
        food: 6,
      },
      micah: { food: 4 },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food → 8
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: feeding (8 - 4 = 4), then Farm Store triggers
    t.choose(game, '1 wood and 1 stone')

    // food: 6 + 2(DL) - 4(feed) - 1(Farm Store) = 3
    t.testBoard(game, {
      dennis: {
        food: 3,
        wood: 1,
        stone: 1,
        grain: 1,
        minorImprovements: ['farm-store-c041'],
      },
    })
  })
})
