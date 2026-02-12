const t = require('../../../testutil_v2.js')

describe("Child's Toy", () => {
  test('is worth 2 VP', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['childs-toy-e030'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -12,
        minorImprovements: ['childs-toy-e030'],
      },
    })
  })
})
