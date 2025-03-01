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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Kaleidoscope')
    request = t.choose(game, request, 'green')

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
