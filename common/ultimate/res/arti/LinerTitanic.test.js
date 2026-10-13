Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Liner Titanic", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Liner Titanic"],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'left'
        },
        blue: ['Experimentation'],
        green: ['Metric System', 'Paper'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Engineering'],
        green: ['Metric System'],
        score: ['Archery', 'Paper', 'Experimentation'],
        museum: ['Museum 1', 'Liner Titanic'],
      },
    })
  })
})
