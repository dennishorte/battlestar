Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Plumbing", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Plumbing'],
        blue: ['Tools', 'Writing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Plumbing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing'],
        blue: ['Tools'],
        score: ['Writing'],
      },
    })
  })
})
