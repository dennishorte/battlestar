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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Machinery'],
      },
    })
  })
})
