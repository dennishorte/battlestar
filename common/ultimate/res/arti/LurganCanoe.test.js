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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        score: ['Archery', 'Oars'],
        museum: ['Museum 1', 'Lurgan Canoe'],
      },
    })
  })
})
