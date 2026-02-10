const t = require('../../../testutil_v2.js')

describe('Potato Ridger', () => {
  test('forces conversion of 1 vegetable to 6 food when 4+ vegetables after harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['potato-ridger-a059'],
        vegetables: 3,
        food: 4, // enough for feeding (2 members × 2)
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 1 }],
        },
      },
      micah: { food: 4 },
      round: 3,
    })
    game.run()

    // Round 4 (harvest round) work phase: 4 simple actions
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis: +1 grain
    t.choose(game, 'Clay Pit')     // micah

    // Harvest → Field Phase:
    //   dennis harvests 1 vegetable → now has 4 vegetables
    //   PotatoRidger: 4+ → forced conversion: -1 veg, +6 food
    // Feeding Phase: dennis has 12 food (4+2+6), needs 4 → 8 left

    t.testBoard(game, {
      dennis: {
        vegetables: 3, // 3 + 1 (harvest) - 1 (Potato Ridger) = 3
        food: 8,       // 4 + 2 (DL) + 6 (Potato Ridger) - 4 (feeding) = 8
        grain: 1,
        minorImprovements: ['potato-ridger-a059'],
        farmyard: {
          fields: [{ row: 0, col: 2 }], // harvested, now empty
        },
      },
    })
  })

  test('offers optional conversion with exactly 3 vegetables after harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['potato-ridger-a059'],
        vegetables: 2,
        food: 4,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 1 }],
        },
      },
      micah: { food: 4 },
      round: 3,
    })
    game.run()

    // Round 4 work phase
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest → Field Phase:
    //   dennis harvests 1 veg → now 3 vegetables
    //   PotatoRidger: exactly 3 → optional conversion offered
    t.choose(game, 'Convert 1 vegetable to 6 food')

    // Feeding: dennis has 12 food (4+2+6), needs 4 → 8

    t.testBoard(game, {
      dennis: {
        vegetables: 2, // 2 + 1 - 1 = 2
        food: 8,       // 4 + 2 + 6 - 4 = 8
        grain: 1,
        minorImprovements: ['potato-ridger-a059'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('does not trigger with fewer than 3 vegetables after harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['potato-ridger-a059'],
        vegetables: 1,
        food: 4,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 1 }],
        },
      },
      micah: { food: 4 },
      round: 3,
    })
    game.run()

    // Round 4 work phase
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: dennis has 2 vegetables (1+1) → no Potato Ridger trigger
    // Feeding: 6 food (4+2), needs 4 → 2

    t.testBoard(game, {
      dennis: {
        vegetables: 2, // 1 + 1 (harvest) = 2
        food: 2,       // 4 + 2 - 4 = 2
        grain: 1,
        minorImprovements: ['potato-ridger-a059'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})
