Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Oculus Quest", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Oculus Quest"],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', "Oculus Quest"],
      },
    })
  })
})

