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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Camcorder')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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
