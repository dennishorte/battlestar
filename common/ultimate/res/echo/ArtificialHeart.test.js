Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Artificial Heart", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Artificial Heart'],
      },
      achievements: ['Machinery', 'Enterprise'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Artificial Heart')

    t.testChoices(request2, ['age 3', 'age 4'])

    const request3 = t.choose(game, request2, 'age 4')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Artificial Heart'],
        achievements: ['Enterprise'],
      },
    })
  })
})
