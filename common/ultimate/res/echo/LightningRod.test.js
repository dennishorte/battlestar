Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Lightning Rod", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Lightning Rod'],
        green: ['Sailing'],
      },
      micah: {
        purple: ['Enterprise', 'Code of Laws'],
      },
      decks: {
        base: {
          5: ['Coal', 'Astronomy', 'Measurement'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Lightning Rod')
    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Lightning Rod'],
        green: ['Measurement'],
        red: ['Coal'],
      },
      micah: {
        purple: ['Code of Laws', 'Astronomy'],
      },
    })
  })
})
