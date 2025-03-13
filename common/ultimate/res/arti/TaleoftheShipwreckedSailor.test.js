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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'purple')

    t.testIsFirstAction(request)
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
