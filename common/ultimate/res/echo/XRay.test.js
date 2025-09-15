Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("X-Ray", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Mobility'],
        blue: ['X-Ray'],
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'right',
        },
        hand: ['Sailing', 'Navigation'],
      },
      decks: {
        base: {
          8: ['Flight', 'Corporations', 'Quantum Theory'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.X-Ray')
    request = t.choose(game, request, 8)
    request = t.choose(game, request, 'Corporations')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['X-Ray'],
        red: ['Mobility', 'Flight'],
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'up',
        },
        forecast: ['Corporations'],
      }
    })
  })
})
