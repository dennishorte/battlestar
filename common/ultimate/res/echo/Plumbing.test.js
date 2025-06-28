Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Plumbing", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Plumbing'],
        green: ['Navigation', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Plumbing')
    request = t.choose(game, request, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing'],
        green: ['Navigation'],
        score: ['Sailing'],
      },
    })
  })
})
