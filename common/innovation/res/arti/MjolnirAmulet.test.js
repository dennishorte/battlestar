Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Mjolnir Amulet", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Mjolnir Amulet"],
      },
      micah: {
        green: ['The Wheel'],
        red: ['Coal', 'Archery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Coal')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        score: ['Archery', 'Coal'],
      },
      micah: {
        green: ['The Wheel'],
      },
    })
  })
})
