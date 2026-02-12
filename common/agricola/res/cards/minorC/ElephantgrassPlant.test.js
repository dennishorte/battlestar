const t = require('../../../testutil_v2.js')

describe('Elephantgrass Plant', () => {
  test('exchange 1 reed for 1 bonus point after harvest', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['elephantgrass-plant-c034'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        reed: 1,
        food: 4,
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food → 6
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field → feeding → breeding → onHarvestEnd → Elephantgrass Plant
    t.choose(game, 'Exchange 1 reed for 1 bonus point')

    // food: 4 + 2 (DL) = 6 - 4 (feed) = 2
    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 1,  // from Grain Seeds
        reed: 0,   // 1 - 1 = 0
        bonusPoints: 1,
        minorImprovements: ['elephantgrass-plant-c034'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })
})
