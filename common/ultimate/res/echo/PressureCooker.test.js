Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pressure Cooker", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Pressure Cooker'],
        red: ['Plumbing'],
        hand: ['Sailing', 'Enterprise'],
      },
      decks: {
        base: {
          2: ['Mathematics'],
        },
        echo: {
          5: ['Octant'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pressure Cooker')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Pressure Cooker'],
        red: ['Plumbing'],
        hand: ['Mathematics', 'Octant'],
      },
    })
  })
})
