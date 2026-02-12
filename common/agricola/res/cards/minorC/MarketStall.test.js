const t = require('../../../testutil_v2.js')

describe('Market Stall (c054)', () => {
  test('exchange 1 grain and 1 fence for 5 food during harvest', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['market-stall-c054'],
        grain: 2,
        food: 4,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] }],
        },
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food → 6
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain → 3
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase → Market Stall triggers after field phase
    t.choose(game, 'Exchange 1 grain and 1 fence for 5 food')

    // Feeding phase: need 4 food (2 workers × 2)
    // food: 4 + 2 (DL) + 5 (Market Stall) = 11 - 4 (feed) = 7
    // grain: 2 + 1 (GS) - 1 (Market Stall) = 2
    t.testBoard(game, {
      dennis: {
        food: 7,
        grain: 2,
        minorImprovements: ['market-stall-c054'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] }],
        },
      },
    })
  })
})
