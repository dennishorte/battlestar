const t = require('../../../testutil_v2.js')

describe('Melon Patch', () => {
  test('plow 1 field when last vegetable harvested', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['melon-patch-e069'],
        virtualFields: {
          'melon-patch-e069': { crop: 'vegetables', cropCount: 1 },
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase harvests 1 veg (last → Melon Patch triggers)
    t.choose(game, 'Plow 1 field')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        vegetables: 1,  // harvested from Melon Patch
        grain: 1,       // Grain Seeds
        food: 8,        // 10 + 2(DL) - 4(feed)
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['melon-patch-e069'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
