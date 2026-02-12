const t = require('../../../testutil_v2.js')

describe('Beer Stall', () => {
  test('exchange grain for food based on empty unfenced stables', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['beer-stall-c049'],
        grain: 2,
        food: 4,
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],  // 2 empty unfenced stables
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

    // Harvest: feeding phase → Beer Stall triggers
    t.choose(game, 'Exchange 2 grain for 10 food')

    // food: 4 + 2 (DL) + 10 (Beer Stall) = 16 - 4 (feed) = 12
    // grain: 2 + 1 (Grain Seeds) - 2 (Beer Stall) = 1
    t.testBoard(game, {
      dennis: {
        food: 12,
        grain: 1,
        minorImprovements: ['beer-stall-c049'],
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
  })
})
