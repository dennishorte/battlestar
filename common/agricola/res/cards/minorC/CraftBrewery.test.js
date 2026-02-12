const t = require('../../../testutil_v2.js')

describe('Craft Brewery', () => {
  test('exchange grain from supply and field for food and bonus points', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['craft-brewery-c063'],
        grain: 2,
        food: 4,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 2 }],
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

    // Harvest: field phase harvests 1 grain from field (cropCount 2→1)
    // Then feeding phase → Craft Brewery triggers
    t.choose(game, 'Exchange 1 grain (supply) + 1 grain (field) for 4 food and 2 bonus points')

    // grain: 2 + 1 (GS) + 1 (harvest) - 1 (Craft Brewery supply) = 3
    // field: cropCount 2 - 1 (harvest) - 1 (Craft Brewery) = 0 → crop null
    // food: 4 + 2 (DL) + 4 (Craft Brewery) = 10 - 4 (feed) = 6
    t.testBoard(game, {
      dennis: {
        grain: 3,
        food: 6,
        bonusPoints: 2,
        minorImprovements: ['craft-brewery-c063'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],  // crop gone, field empty
        },
      },
    })
  })
})
