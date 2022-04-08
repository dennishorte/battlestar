Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("The Wealth of Nations", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Wealth of Nations"],
        score: ['Canning', 'Software'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          4: ['Gunpowder'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        score: ['Sailing', 'Gunpowder', 'Canning', 'Software'],
      },
    })
  })
})
