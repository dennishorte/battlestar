Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("The Communist Manifesto", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["The Communist Manifesto"],
      },
      decks: {
        base: {
          6: ['Classification', 'Metric System', 'Democracy'],
          7: ['Lighting', 'Railroad'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Railroad')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Railroad'],
        hand: ['Classification', 'Metric System', 'Democracy'],
      },
      micah: {
        purple: ['Lighting'],
      }
    })
  })
})
