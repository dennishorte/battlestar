const t = require('../../../testutil_v2.js')

describe('Food Merchant', () => {
  test('buys vegetable for 3 food when harvesting grain', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest
      dennis: {
        occupations: ['food-merchant-d113'],
        food: 5,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Work phase
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase harvests 1 grain (cropCount 2→1)
    // onHarvestGrain fires → Food Merchant offers
    t.choose(game, 'Buy 1 vegetable for 3 food')

    // dennis: grain 0 + 1(GrainSeeds) + 1(harvest) = 2
    // food: 5 + 2(DL) - 3(merchant) - 4(feeding) = 0
    // vegetables: 1
    t.testBoard(game, {
      dennis: {
        occupations: ['food-merchant-d113'],
        grain: 2,
        food: 0,
        vegetables: 1,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('can skip buying vegetable', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      dennis: {
        occupations: ['food-merchant-d113'],
        food: 5,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: skip Food Merchant
    t.choose(game, 'Skip')

    // dennis: food 5 + 2(DL) - 4(feeding) = 3
    t.testBoard(game, {
      dennis: {
        occupations: ['food-merchant-d113'],
        grain: 2,
        food: 3,
        vegetables: 0,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('does not trigger without grain in fields', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 4,
      dennis: {
        occupations: ['food-merchant-d113'],
        food: 5,
        // no fields with grain
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // No Food Merchant prompt (no grain harvested from fields)
    // dennis: food 5 + 2(DL) - 4(feeding) = 3
    t.testBoard(game, {
      dennis: {
        occupations: ['food-merchant-d113'],
        grain: 1,
        food: 3,
        vegetables: 0,
      },
    })
  })
})
