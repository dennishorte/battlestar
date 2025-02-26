Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Lurgan Canoe", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Lurgan Canoe"],
        red: ['Archery', 'Oars'],
        hand: ['Construction'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        score: ['Archery', 'Oars'],
      },
    })
  })
})
