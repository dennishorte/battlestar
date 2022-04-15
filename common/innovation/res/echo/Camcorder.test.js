Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Camcorder", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Camcorder'],
      },
      micah: {
        hand: ['Sailing', 'Composites'],
      },
      decks: {
        base: {
          9: ['Fission', 'Services', 'Satellites'],
        },
        echo: {
          9: ['Calculator'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Camcorder')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Composites', 'Camcorder'],
        hand: ['Services', 'Satellites', 'Calculator'],
      },
      micah: {
        hand: ['Fission'],
      },
    })
  })
})
