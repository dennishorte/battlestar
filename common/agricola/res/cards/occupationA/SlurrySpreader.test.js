const t = require('../../../testutil_v2.js')

describe('Slurry Spreader', () => {
  test('onHarvestLastCrop gives 2 food when taking last grain from field', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['slurry-spreader-a106'],
        food: 8,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 }, // Will be empty after harvest
          ],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    // Play through all 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase harvests 1 grain (last from field) → onHarvestLastCrop gives +2 food
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        grain: 2, // 0 + 1 (Grain Seeds) + 1 (harvest)
        food: 8,  // 8 + 2 (Day Laborer) + 2 (Slurry Spreader) - 4 (feeding)
        occupations: ['slurry-spreader-a106'],
        farmyard: {
          fields: [
            { row: 0, col: 2 }, // Empty after harvest
          ],
        },
      },
    })
  })

  test('onHarvestLastCrop gives 1 food when taking last vegetable from field', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['slurry-spreader-a106'],
        food: 8,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 }, // Will be empty after harvest
          ],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    // Play through all 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase harvests 1 vegetable (last from field) → onHarvestLastCrop gives +1 food
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        vegetables: 1, // 0 + 1 (harvest)
        grain: 1, // 0 + 1 (Grain Seeds)
        food: 7,  // 8 + 2 (Day Laborer) + 1 (Slurry Spreader) - 4 (feeding)
        occupations: ['slurry-spreader-a106'],
        farmyard: {
          fields: [
            { row: 0, col: 2 }, // Empty after harvest
          ],
        },
      },
    })
  })

  test('onHarvestLastCrop does not trigger when field still has crops after harvest', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['slurry-spreader-a106'],
        food: 8,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 }, // Will have 2 after harvest
          ],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    // Play through all 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase harvests 1 grain (field still has 2) → onHarvestLastCrop does NOT trigger
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        grain: 2, // 0 + 1 (Grain Seeds) + 1 (harvest)
        food: 6,  // 8 + 2 (Day Laborer) - 4 (feeding) - no Slurry Spreader bonus
        occupations: ['slurry-spreader-a106'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 }, // Still has crops
          ],
        },
      },
    })
  })

  test('onHarvestLastCrop triggers for multiple fields that become empty', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['slurry-spreader-a106'],
        food: 8,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 }, // Will be empty
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 }, // Will be empty
          ],
        },
      },
      micah: { food: 8 },
    })
    game.run()

    // Play through all 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: both fields become empty → onHarvestLastCrop triggers twice
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        grain: 2, // 0 + 1 (Grain Seeds) + 1 (harvest)
        vegetables: 1, // 0 + 1 (harvest)
        food: 9,  // 8 + 2 (Day Laborer) + 2 (grain last) + 1 (vegetable last) - 4 (feeding)
        occupations: ['slurry-spreader-a106'],
        farmyard: {
          fields: [
            { row: 0, col: 2 }, // Empty
            { row: 0, col: 3 }, // Empty
          ],
        },
      },
    })
  })
})
