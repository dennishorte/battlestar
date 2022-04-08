Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Tortugas Galleon", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Tortugas Galleon"],
      },
      micah: {
        red: ['Coal'],
        blue: ['Mathematics'],
        score: ['Sailing', 'Calendar', 'Construction'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        score: ['Calendar', 'Construction'],
      },
      micah: {
        red: ['Coal'],
        score: ['Sailing'],
      },
    })
  })
})
