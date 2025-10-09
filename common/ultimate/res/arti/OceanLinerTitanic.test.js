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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Engineering'],
        green: ['Metric System'],
        score: ['Archery', 'Paper', 'Experimentation'],
        museum: ['Museum 1', 'Ocean Liner Titanic'],
      },
    })
  })
})
