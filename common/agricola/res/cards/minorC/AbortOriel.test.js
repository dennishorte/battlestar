const t = require('../../../testutil_v2.js')

describe('Abort Oriel', () => {
  test('is worth 3 VP', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['abort-oriel-c032'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -11,
        minorImprovements: ['abort-oriel-c032'],
      },
    })
  })
})
