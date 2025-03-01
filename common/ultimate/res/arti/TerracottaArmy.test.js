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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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
