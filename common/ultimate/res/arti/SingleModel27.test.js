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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'The Wheel')

    t.testIsFirstAction(request)
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
