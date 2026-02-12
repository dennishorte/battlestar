const t = require('../../../testutil_v2.js')

describe('Furrows', () => {
  test('allows sowing in 1 field on play', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['furrows-d003'],
        grain: 1,
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Furrows')
    // Sow the field
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 0,
        food: 1, // Meeting Place gives 1 food
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
        },
        minorImprovements: ['furrows-d003'],
      },
    })
  })
})
