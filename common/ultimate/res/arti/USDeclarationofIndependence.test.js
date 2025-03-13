Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("U.S. Declaration of Independence", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["U.S. Declaration of Independence"],
      },
      micah: {
        red: ['Flight'],
        blue: ['Chemistry'],
        green: ['Databases'],
        hand: ['Canning', 'Enterprise'],
        score: ['Sailing', 'Navigation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Chemistry'],
        hand: ['Canning'],
        score: ['Navigation'],
      },
      micah: {
        red: ['Flight'],
        green: ['Databases'],
        hand: ['Enterprise'],
        score: ['Sailing'],
      },
    })
  })
})
