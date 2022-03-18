Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Baroque-Longue la Belle', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Baroque-Longue la Belle'],
      },
      decks: {
        base: {
          5: ['Astronomy', 'Metric System'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        green: ['Metric System'],
      },
    })
  })
})
