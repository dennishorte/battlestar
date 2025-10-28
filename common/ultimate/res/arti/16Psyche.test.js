Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("16 Psyche", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["16 Psyche"],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', "16 Psyche"],
      },
    })
  })
})
