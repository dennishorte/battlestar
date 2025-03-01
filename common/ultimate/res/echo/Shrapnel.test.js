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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shrapnel')

    t.testIsSecondPlayer(game)
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
