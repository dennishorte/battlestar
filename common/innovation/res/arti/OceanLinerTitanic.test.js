Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ocean Liner Titanic", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Ocean Liner Titanic"],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        blue: ['Experimentation'],
        green: ['Metric System', 'Paper'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Engineering'],
        green: ['Metric System'],
        score: ['Archery', 'Paper', 'Experimentation'],
      },
    })
  })
})
