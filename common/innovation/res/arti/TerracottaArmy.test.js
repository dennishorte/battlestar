Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Terracotta Army", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Terracotta Army"],
        hand: ['Calendar', 'Mapmaking'],
      },
      micah: {
        green: ['Navigation'],
        hand: ['Agriculture', 'The Wheel'],
      },
      decks: {
        base: {
          1: ['Sailing'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        score: ['Calendar'],
        hand: ['Mapmaking', 'Sailing'],
      },
      micah: {
        hand: ['The Wheel'],
        score: ['Agriculture'],
      },
    })
  })
})
