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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        blue: ['Calendar'],
        score: ['Sailing'],
        hand: ['Tools'],
        museum: ['Museum 1', 'Sibidu Needle'],
      },
    })
  })
})
