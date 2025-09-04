Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Touchscreen", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Touchscreen'],
      },
      decks: {
        base: {
          3: ['Engineering'],
          4: ['Colonialism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Touchscreen')
    request = t.choose(game, request, 4)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Touchscreen'],
      },
    })
  })
})
