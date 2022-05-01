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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Plumbing')
    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing'],
        green: ['Navigation'],
        score: ['Sailing'],
      },
    })
  })
})
