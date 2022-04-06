Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ship of the Line Sussex", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Ship of the Line Sussex"],
        score: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
    })
  })

  test('dogma: empty score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Ship of the Line Sussex"],
        blue: ['Tools', 'Calendar'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        score: ['Tools', 'Calendar'],
      }
    })
  })
})
