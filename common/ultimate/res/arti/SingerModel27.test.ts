Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Singer Model 27", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Singer Model 27"],
        green: ['Clothing'],
        hand: ['Sailing'],
        score: ['The Wheel', 'Navigation', 'Tools'],
      },
      achievements: ['Coal'],
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
        museum: ['Museum 1', 'Singer Model 27'],
      },
      junk: ['Coal'],
    })
  })
})
