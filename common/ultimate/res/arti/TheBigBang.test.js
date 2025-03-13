Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("The Big Bang", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Big Bang"],
        blue: ['Mathematics'],
        hand: ['Societies'],
      },
      decks: {
        base: {
          6: ['Encyclopedia'],
          10: ['Software'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Societies')
    request = t.choose(game, request, 'no')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Encyclopedia', 'Mathematics'],
      },
      junk: ['Software'],
    })
  })
})
