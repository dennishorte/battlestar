Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Luna 3", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Luna 3"],
        score: ['Tools', 'Canning', 'Sailing'],
      },
      decks: {
        base: {
          3: ['Machinery']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        score: ['Machinery'],
      },
    })
  })
})
