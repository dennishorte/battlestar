Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Single Model 27", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Single Model 27"],
        green: ['Clothing'],
        hand: ['Sailing'],
        score: ['The Wheel', 'Navigation', 'Tools'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'The Wheel')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Clothing', 'Sailing', 'The Wheel', 'Navigation'],
          splay: 'up'
        },
        score: ['Tools'],
      },
    })
  })
})
