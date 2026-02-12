const t = require('../../../testutil_v2.js')

describe('Field Clay', () => {
  test('gives 1 clay per planted field', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['field-clay-d005'],
        food: 1,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Field Clay')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 2,
        food: 1, // Meeting Place gives 1 food
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 2 },
          ],
        },
        minorImprovements: ['field-clay-d005'],
      },
    })
  })
})
