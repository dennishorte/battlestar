Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jumbo Kingdom", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jumbo Kingdom"],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', "Jumbo Kingdom"],
      },
    })
  })
})

