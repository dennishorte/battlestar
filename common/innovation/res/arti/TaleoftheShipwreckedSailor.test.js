Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Tale of the Shipwrecked Sailor", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Tale of the Shipwrecked Sailor"],
        purple: ['Monotheism'],
        hand: ['Code of Laws'],
      },
      decks: {
        base: {
          1: ['Sailing'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'purple')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Code of Laws', 'Monotheism'],
          splay: 'left'
        },
        hand: ['Sailing'],
      }
    })
  })
})
