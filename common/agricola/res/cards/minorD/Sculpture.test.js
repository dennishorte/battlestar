const t = require('../../../testutil_v2.js')

describe('Sculpture', () => {
  test('is worth 2 VP', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['sculpture-d037'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -12,
        minorImprovements: ['sculpture-d037'],
      },
    })
  })
})
