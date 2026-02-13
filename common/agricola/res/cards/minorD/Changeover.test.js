const t = require('../../../testutil_v2.js')

describe('Changeover', () => {
  test('after harvest, sow grain in field that dropped to 1 crop', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['changeover-d071'],
        grain: 2,
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to complete round 4 (harvest round)
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: field phase → grain(2→1) → onFieldPhaseEnd → Changeover offers
    // Sow grain: discards 1 grain, sows 1 grain from supply (= 3 total on field)
    t.choose(game, 'Sow grain at (0,2)')

    // grain: 2 + 1(normal harvest) + 1(GS) - 1(sow) = 3
    // food: 10 + 2(DL) - 4(feed) = 8
    t.testBoard(game, {
      dennis: {
        grain: 3,
        food: 8,
        minorImprovements: ['changeover-d071'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
  })

  test('skip Changeover', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['changeover-d071'],
        grain: 1,
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest: veg(2→1) → Changeover offers → skip
    t.choose(game, 'Skip')

    // veg: 0 + 1(normal harvest) = 1
    // grain: 1 + 1(GS) = 2
    t.testBoard(game, {
      dennis: {
        grain: 2,
        vegetables: 1,
        food: 8,
        minorImprovements: ['changeover-d071'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('does not trigger when field empties (cropCount was 1)', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['changeover-d071'],
        grain: 2,
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest: grain(1→0) → no Changeover trigger (field emptied, not at 1)
    // No additional t.choose needed — goes straight to feeding

    // grain: 2 + 1(harvest) + 1(GS) = 4
    t.testBoard(game, {
      dennis: {
        grain: 4,
        food: 8,
        minorImprovements: ['changeover-d071'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },  // emptied by harvest
          ],
        },
      },
    })
  })
})
