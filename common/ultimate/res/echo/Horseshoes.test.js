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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Horseshoes')

    t.testIsSecondPlayer(request2)
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
