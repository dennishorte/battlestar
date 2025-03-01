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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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
