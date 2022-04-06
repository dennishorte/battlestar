Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sibidu Needle", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Sibidu Needle"],
        green: ['The Wheel'],
        blue: ['Calendar'],
      },
      decks: {
        base: {
          1: ['Sailing', 'Tools'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        blue: ['Calendar'],
        score: ['Sailing'],
        hand: ['Tools'],
      },
    })
  })
})
