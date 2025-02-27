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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Societies')
    const request4 = t.choose(game, request3, 'no')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        blue: ['Encyclopedia', 'Mathematics'],
      },
      junk: ['Software'],
    })
  })
})
