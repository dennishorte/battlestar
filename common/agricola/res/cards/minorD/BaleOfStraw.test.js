const t = require('../../../testutil_v2.js')

describe('Bale of Straw', () => {
  test('gives 2 food at harvest start with 3 grain fields', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['bale-of-straw-d061'],
        food: 0,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 1, col: 2, crop: 'grain', cropCount: 1 },
            { row: 2, col: 2, crop: 'grain', cropCount: 3 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: BaleOfStraw fires at start (+2 food)
    // Field phase: harvest 1 grain each from 3 fields = +3 grain
    // dennis food: 0 + 2(DL) + 1(Fish) + 2(BaleOfStraw) - 4(feed) = 1
    // dennis grain: 0 + 3(harvest) = 3

    t.testBoard(game, {
      dennis: {
        food: 1,
        grain: 3,
        minorImprovements: ['bale-of-straw-d061'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 1, col: 2 },   // cropCount was 1, now 0 → empty field
            { row: 2, col: 2, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
  })

  test('does not fire with fewer than 3 grain fields', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['bale-of-straw-d061'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 1, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: BaleOfStraw does NOT fire (only 2 grain fields)
    // Field phase: harvest 1 grain each from 2 fields = +2 grain
    // dennis food: 10 + 2(DL) + 1(Fish) - 4(feed) = 9

    t.testBoard(game, {
      dennis: {
        food: 9,
        grain: 2,
        minorImprovements: ['bale-of-straw-d061'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 1, col: 2 },   // cropCount was 1, now 0 → empty
          ],
        },
      },
    })
  })
})
