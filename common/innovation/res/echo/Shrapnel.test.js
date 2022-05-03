Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Shrapnel", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Shrapnel'],
        yellow: ['Agriculture', 'Masonry'],
      },
      micah: {
        yellow: ['Machinery', 'Fermenting',],
      },
      decks: {
        base: {
          6: ['Canning'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Shrapnel')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Shrapnel'],
        yellow: ['Agriculture'],
        score: ['Machinery', 'Fermenting'],
      },
      micah: {
        yellow: ['Canning'],
        score: ['Masonry'],
      },
    })
  })
})
