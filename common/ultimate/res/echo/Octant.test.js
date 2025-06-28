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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Octant')

    t.testChoices(request, ['Canning', 'Pottery'])

    request = t.choose(game, request, 'Pottery')

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
