const t = require('../../../testutil_v2.js')

describe('Crop Rotation Field', () => {
  test('sow vegetables after last grain harvested', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['crop-rotation-field-e070'],
        virtualFields: {
          'crop-rotation-field-e070': { crop: 'grain', cropCount: 1 },
        },
        vegetables: 1,
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

    // Harvest: last grain harvested → onHarvestLast fires → sow vegetables
    t.choose(game, 'Sow vegetables on Crop Rotation Field')

    // Grain: 0+1(harvest)+1(GS)=2, Veg: 1-1(sowed)=0
    // Virtual field now has 2 vegetables (sowing amount)
    t.testBoard(game, {
      dennis: {
        grain: 2,       // 1(harvest) + 1(GS)
        vegetables: 0,  // 1 - 1(sowed)
        food: 8,        // 10 + 2(DL) - 4(feed)
        occupations: ['test-occupation-1'],
        minorImprovements: ['crop-rotation-field-e070'],
      },
    })
  })

  test('sow grain after last vegetable harvested', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['crop-rotation-field-e070'],
        virtualFields: {
          'crop-rotation-field-e070': { crop: 'vegetables', cropCount: 1 },
        },
        grain: 1,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: grain 1+1=2
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: last veg harvested → onHarvestLast fires → sow grain
    t.choose(game, 'Sow grain on Crop Rotation Field')

    // Grain: 2-1(sowed)+1(harvest from vf? no, vf just got sown)=1
    // Wait - GS gives 1 grain, so grain=2. Then sow 1 grain → grain=1.
    t.testBoard(game, {
      dennis: {
        grain: 1,       // 1 + 1(GS) - 1(sowed)
        vegetables: 1,  // 1 harvested from vf
        food: 8,        // 10 + 2(DL) - 4(feed)
        occupations: ['test-occupation-1'],
        minorImprovements: ['crop-rotation-field-e070'],
      },
    })
  })
})
