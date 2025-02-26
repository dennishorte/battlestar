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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 6)
    const request4 = t.choose(game, request3, 'Archery')

    t.testIsFirstAction(request4)
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
