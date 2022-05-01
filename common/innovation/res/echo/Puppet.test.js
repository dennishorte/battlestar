Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Puppet", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Puppet'],
        red: ['Plumbing'],
        hand: ['Sailing', 'Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Puppet')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Puppet'],
        red: ['Plumbing'],
        hand: ['Sailing', 'Enterprise'],
      },
    })
  })
})
