const t = require('../../../testutil_v2.js')

describe('Raised Bed', () => {
  test('gives 4 food at start of harvest', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['raised-bed-e061'],
        food: 0,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 1, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 4 actions
    t.choose(game, 'Day Laborer')   // dennis (+2 food)
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis (+1 food)
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: Raised Bed fires (+4 food)
    // Field phase: harvest 1 grain from each of 2 fields = +2 grain
    // food: 0 + 2(DL) + 1(Fish) + 4(RaisedBed) - 4(feed) = 3

    t.testBoard(game, {
      dennis: {
        food: 3,
        grain: 2,
        minorImprovements: ['raised-bed-e061'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },   // cropCount was 1, now 0 → empty
            { row: 1, col: 2 },   // cropCount was 1, now 0 → empty
          ],
        },
      },
    })
  })
})
