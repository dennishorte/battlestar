Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Horseshoes", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Horseshoes'],
        yellow: ['Masonry'],
      },
      micah: {
        green: ['Navigation'],
        yellow: ['Canning'],
        purple: ['Mysticism'],
      },
      decks: {
        usee: {
          2: ['Watermill', 'Chaturanga'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Horseshoes')
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Horseshoes'],
        green: ['Navigation'],
        yellow: ['Masonry'],
        forecast: ['Watermill'],
      },
      micah: {
        yellow: ['Canning'],
        purple: ['Chaturanga', 'Mysticism'],
      },
    })
  })
})
