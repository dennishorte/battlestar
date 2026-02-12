const t = require('../../../testutil_v2.js')

describe('Feed Pellets', () => {
  test('exchange 1 vegetable for 1 animal of type you have', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feed-pellets-d084'],
        vegetables: 1,
        food: 4,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 1 }],
        },
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: feeding phase → Feed Pellets offers (has sheep)
    t.choose(game, 'Pay 1 vegetable for 1 sheep')

    // vegetables: 1 - 1 = 0, sheep: 1 + 1 (FP) + 1 (breeding: 2 sheep → baby) = 3
    // food: 4 + 2 (DL) = 6 - 4 (feed) = 2
    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 1,  // from Grain Seeds
        animals: { sheep: 3 },
        minorImprovements: ['feed-pellets-d084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 3 }],
        },
      },
    })
  })
})
