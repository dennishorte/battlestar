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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Artificial Heart')

    t.testChoices(request, ['age 3', 'age 4'])

    request = t.choose(game, request, 'age 4')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Artificial Heart'],
        achievements: ['Enterprise'],
      },
    })
  })
})
