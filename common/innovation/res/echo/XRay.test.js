Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Garland's Ruby Slippers", () => {

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.X-Ray')
    const request3 = t.choose(game, request2, 8)
    const request4 = t.choose(game, request3, 9)
    const request5 = t.choose(game, request4, 'yellow')

    t.testIsFirstAction(request5)
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
