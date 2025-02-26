Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Barometer", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Barometer'],
        forecast: ['Coal', 'Experimentation'],
      },
      micah: {
        purple: ['Chaturanga'],
      },
      decks: {
        echo: {
          5: ['Palampore'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Barometer')
    const request3 = t.choose(game, request2, 'no')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        yellow: ['Barometer'],
        forecast: ['Palampore', 'Experimentation'],
        hand: ['Coal'],
      },
      micah: {
        purple: ['Chaturanga'],
      },
    })
  })
})
