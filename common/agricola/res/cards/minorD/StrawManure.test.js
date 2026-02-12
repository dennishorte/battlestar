const t = require('../../../testutil_v2.js')

describe('Straw Manure', () => {
  test('pay 1 grain to add vegetable to 2 vegetable fields before harvest', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['straw-manure-d070'],
        grain: 2,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 },
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
    t.choose(game, 'Grain Seeds')   // dennis: grain 2+1=3
    t.choose(game, 'Clay Pit')      // micah

    // Harvest → onBeforeFieldPhase: Straw Manure triggers
    t.choose(game, 'Pay 1 grain to add vegetable to 2 fields')
    // Fields: (0,2) 2+1=3 veg, (0,3) 1+1=2 veg
    // Then harvest: (0,2) 3→2, (0,3) 2→1 → 2 veg harvested
    // Grain: 3-1(Straw Manure)=2
    // Veg: 0+2(harvested)=2
    // Feeding: 10+2(DL)-4(feed)=8

    t.testBoard(game, {
      dennis: {
        grain: 2,       // 2 + 1(GS) - 1(Straw Manure)
        vegetables: 2,  // 1(harvest from 3→2) + 1(harvest from 2→1)
        food: 8,        // 10 + 2(DL) - 4(feed)
        minorImprovements: ['straw-manure-d070'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('single vegetable field gets 1 vegetable added', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['straw-manure-d070'],
        grain: 1,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 3 },  // empty field (for prereq)
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

    // Harvest → Straw Manure: only 1 veg field
    t.choose(game, 'Pay 1 grain to add vegetable to 1 field')
    // Field (0,2): 1+1=2 veg, then harvest → 2→1 = 1 veg harvested
    // Grain: 1+1(GS)-1(Straw)=1

    t.testBoard(game, {
      dennis: {
        grain: 1,       // 1 + 1(GS) - 1(Straw)
        vegetables: 1,  // 1 harvested from (0,2)
        food: 8,        // 10 + 2(DL) - 4(feed)
        minorImprovements: ['straw-manure-d070'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 3 },
          ],
        },
      },
    })
  })
})
