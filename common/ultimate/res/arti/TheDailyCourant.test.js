Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("The Daily Courant", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Daily Courant"],
        red: ['Archery'],
        blue: ['Mathematics'],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Canning'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          6: ['Encyclopedia'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 6)
    request = t.choose(game, request, 'Archery')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        blue: ['Mathematics'],
        hand: ['Canning'],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Sailing'],
      },
    })
  })
})
