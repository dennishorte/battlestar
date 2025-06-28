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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pressure Cooker')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 2)

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
