const t = require('../../../testutil_v2.js')

describe('Eternal Rye Cultivation', () => {
  test('gives 1 food after harvest with 2 grain in supply', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['eternal-rye-cultivation-c066'],
        grain: 2,
        food: 10,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Field phase harvests 1 grain from field → 3 in supply + 1 Grain Seeds = 4
    // onHarvestEnd: 4 grain ≥ 3 → +1 grain = 5
    // Feeding: -4 food. 10 + 2(DL) - 4(feed) = 8
    t.testBoard(game, {
      dennis: {
        food: 8,
        grain: 5, // 2(initial) + 1(field harvest) + 1(Grain Seeds) + 1(ERC)
        minorImprovements: ['eternal-rye-cultivation-c066'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 2 }],
        },
      },
    })
  })

  test('gives 1 food after harvest with exactly 2 grain', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['eternal-rye-cultivation-c066'],
        grain: 1,
        food: 10,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Clay Pit')    // dennis
    t.choose(game, 'Grain Seeds') // micah

    // Field phase harvests 1 grain from field → 1 + 1 = 2 in supply
    // onHarvestEnd: 2 grain ≥ 2 but < 3 → +1 food (not grain)
    // Feeding: -4 food. 10 + 2(DL) + 1(ERC food) - 4(feed) = 9
    t.testBoard(game, {
      dennis: {
        food: 9,
        grain: 2, // 1(initial) + 1(field harvest)
        clay: 1,
        minorImprovements: ['eternal-rye-cultivation-c066'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 2 }],
        },
      },
    })
  })
})
