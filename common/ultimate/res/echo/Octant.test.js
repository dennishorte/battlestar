Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Octant", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Octant'],
      },
      micah: {
        red: ['Coal'],
        blue: ['Pottery'],
        green: ['The Wheel'],
        yellow: ['Canning'],
      },
      decks: {
        base: {
          6: ['Metric System', 'Atomic Theory'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Octant')

    t.testChoices(request2, ['Canning', 'Pottery'])

    const request3 = t.choose(game, request2, 'Pottery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Octant'],
        blue: ['Pottery'],
        forecast: ['Atomic Theory'],
      },
      micah: {
        red: ['Coal'],
        green: ['The Wheel'],
        yellow: ['Canning'],
        forecast: ['Metric System'],
      },
    })
  })
})
