Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("X-Ray", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['X-Ray'],
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'right',
        },
      },
      decks: {
        base: {
          8: ['Flight', 'Corporations'],
          9: ['Computers'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.X-Ray')
    request = t.choose(game, request, 8)
    request = t.choose(game, request, 9)
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['X-Ray'],
        red: ['Flight'],
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'up',
        },
        forecast: ['Corporations', 'Computers'],
      }
    })
  })
})
