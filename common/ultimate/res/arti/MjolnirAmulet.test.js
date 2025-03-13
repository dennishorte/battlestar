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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Coal')

    t.testIsFirstAction(request)
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
