const t = require('../../../testutil_v2.js')

describe('Thunderbolt', () => {
  test('remove grain from field for 2 wood each', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['thunderbolt-e004'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Thunderbolt')

    // Single grain field → auto-selected, no choice prompt
    // 3 grain removed → 6 wood
    t.testBoard(game, {
      dennis: {
        wood: 6,
        food: 1,  // Meeting Place gives 1 food
        minorImprovements: ['thunderbolt-e004'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],  // field now empty
        },
      },
    })
  })
})
