const t = require('../../../testutil_v2.js')

describe('Lettuce Patch', () => {
  test('convert harvested vegetables to food', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['lettuce-patch-c070'],
        virtualFields: {
          'lettuce-patch-c070': { crop: 'vegetables', cropCount: 2 },
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase harvests 1 veg from Lettuce Patch → onHarvest fires
    t.choose(game, 'Convert 1 vegetable to 4 food')

    // Feeding: 10+2(DL)+4(converted)-4(feed)=12
    // Vegetables: 0 (1 harvested - 1 converted = 0)
    t.testBoard(game, {
      dennis: {
        grain: 1,       // Grain Seeds
        vegetables: 0,  // 1 harvested - 1 converted
        food: 12,       // 10 + 2(DL) + 4(Lettuce) - 4(feed)
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['lettuce-patch-c070'],
      },
    })
  })

  test('keep vegetables instead of converting', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['lettuce-patch-c070'],
        virtualFields: {
          'lettuce-patch-c070': { crop: 'vegetables', cropCount: 1 },
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: last veg harvested → onHarvest fires
    t.choose(game, 'Keep vegetables')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        vegetables: 1,  // kept the harvested vegetable
        food: 8,        // 10 + 2(DL) - 4(feed)
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['lettuce-patch-c070'],
      },
    })
  })
})
