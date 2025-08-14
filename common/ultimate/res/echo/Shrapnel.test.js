Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Shrapnel", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Shrapnel'],
        yellow: ['Agriculture', 'Masonry'],
        green: ['Measurement'],
      },
      micah: {
        yellow: ['Machinery', 'Fermenting',],
        green: ['Paper'],
      },
      decks: {
        base: {
          6: ['Canning'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shrapnel')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Shrapnel'],
        yellow: ['Agriculture'],
        green: ['Measurement'],
        score: ['Machinery', 'Fermenting'],
      },
      micah: {
        yellow: ['Canning'],
        green: ['Paper'],
        score: ['Masonry'],
      },
    })
  })
})
