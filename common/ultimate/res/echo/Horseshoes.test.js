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
        red: ['Archery'],
      },
      decks: {
        base: {
          2: ['Fermenting', 'Construction']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Horseshoes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Horseshoes'],
        green: ['Navigation'],
        yellow: ['Masonry'],
        forecast: ['Fermenting'],
      },
      micah: {
        yellow: ['Canning'],
        red: ['Construction', 'Archery'],
      },
    })
  })
})
