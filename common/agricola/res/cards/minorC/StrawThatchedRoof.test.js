const t = require('../../../testutil_v2.js')

describe('Straw-thatched Roof', () => {
  test('removes reed cost from renovation', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['straw-thatched-roof-c014'],
        clay: 2, // renovation cost without reed
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
            { row: 0, col: 4, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    // Dennis renovates (wood→clay) with no reed required
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        minorImprovements: ['straw-thatched-roof-c014'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
            { row: 0, col: 4, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })
})
