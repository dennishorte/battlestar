const t = require('../../../testutil_v2.js')

describe('Dwelling Mound', () => {
  test('is worth 3 VP', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['dwelling-mound-c037'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -11,
        minorImprovements: ['dwelling-mound-c037'],
      },
    })
  })
})
