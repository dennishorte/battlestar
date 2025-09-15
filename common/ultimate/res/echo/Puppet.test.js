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
        score: ['Monotheism'],
      },
      achievements: ['Tools', 'Fermenting', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Puppet')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Puppet'],
        red: ['Plumbing'],
        hand: ['Sailing', 'Enterprise'],
        score: ['Monotheism'],
      },
      junk: ['Fermenting'],
    })
  })
})
