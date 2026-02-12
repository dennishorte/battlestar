const t = require('../../../testutil_v2.js')

describe('Scythe', () => {
  test('harvest all crops from one field during field phase', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['scythe-e073'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 2 },
          ],
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

    // Harvest: normal harvest removes 1 from each field → grain(3→2), veg(2→1)
    // Then onFieldPhase → Scythe: select grain field to harvest all remaining
    t.choose(game, 'Field (0,2) - grain: 2')

    // Grain: 0+1(normal harvest)+2(Scythe)+1(GS)=4
    // Veg: 0+1(normal harvest)=1
    t.testBoard(game, {
      dennis: {
        grain: 4,       // 1(normal) + 2(Scythe) + 1(GS)
        vegetables: 1,  // 1(normal harvest)
        food: 8,        // 10 + 2(DL) - 4(feed)
        minorImprovements: ['scythe-e073'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },                                   // emptied by Scythe
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 }, // 2→1 normal
          ],
        },
      },
    })
  })

  test('skip Scythe harvest', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['scythe-e073'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
          ],
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

    // Harvest: normal → grain field 3→2, Scythe offers but player skips
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        grain: 2,       // 1(normal harvest) + 1(GS)
        food: 8,        // 10 + 2(DL) - 4(feed)
        minorImprovements: ['scythe-e073'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
  })
})
