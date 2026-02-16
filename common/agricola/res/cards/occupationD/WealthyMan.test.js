const t = require('../../../testutil_v2.js')

describe('Wealthy Man', () => {
  test('gives 1 bonus point at 1st harvest when player has 1 grain field', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 4, // 1st harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wealthy-man-d153'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
        food: 8,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis
    t.choose(game, 'Reed Bank')     // micah

    // Harvest fires: 1st harvest, grainFields (1) >= harvestNumber (1) => +1 bonus point
    // Field phase harvests 1 grain from field
    t.testBoard(game, {
      round: 5,
      dennis: {
        food: 6,  // 8 + 2 (DL) - 4 (feeding)
        grain: 1, // harvested from field
        clay: 1,  // from Clay Pit
        bonusPoints: 1,
        occupations: ['wealthy-man-d153'],
        farmyard: {
          fields: [{ row: 2, col: 0 }], // grain harvested, now empty field
        },
      },
    })
  })

  test('gives 0 bonus points at 1st harvest when player has 0 grain fields', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 4, // 1st harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wealthy-man-d153'],
        food: 8,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis
    t.choose(game, 'Reed Bank')     // micah

    // Harvest fires: 1st harvest, grainFields (0) < harvestNumber (1) => no bonus
    t.testBoard(game, {
      round: 5,
      dennis: {
        food: 6,  // 8 + 2 (DL) - 4 (feeding)
        clay: 1,
        bonusPoints: 0,
        occupations: ['wealthy-man-d153'],
      },
    })
  })

  test('gives 1 bonus point at 2nd harvest when player has 2 grain fields', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 7, // 2nd harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wealthy-man-d153'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 1 },
            { row: 2, col: 1, crop: 'grain', cropCount: 1 },
          ],
        },
        food: 8,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis
    t.choose(game, 'Reed Bank')     // micah

    // Harvest fires: 2nd harvest, grainFields (2) >= harvestNumber (2) => +1 bonus point
    t.testBoard(game, {
      round: 8,
      dennis: {
        food: 6,  // 8 + 2 (DL) - 4 (feeding)
        grain: 2, // 2 harvested from 2 fields
        clay: 1,
        bonusPoints: 1,
        occupations: ['wealthy-man-d153'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
          ],
        },
      },
    })
  })
})
