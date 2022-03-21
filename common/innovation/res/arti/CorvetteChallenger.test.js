Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Corvette Challenger', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Corvette Challenger'],
        blue: ['Physics', 'Chemistry'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          8: ['Rocketry'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Physics', 'Chemistry', 'Rocketry'],
          splay: 'up'
        },
        score: ['Machinery'],
      },
    })
  })
})
