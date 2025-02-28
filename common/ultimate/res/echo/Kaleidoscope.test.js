Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Kaleidoscope", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Kaleidoscope'],
        green: ['Sailing', 'The Wheel'],
      },
      decks: {
        base: {
          7: ['Bicycle'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Kaleidoscope')
    const request3 = t.choose(game, request2, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Kaleidoscope'],
        green: {
          cards: ['Bicycle', 'Sailing', 'The Wheel'],
          splay: 'right',
        }
      },
    })
  })
})
