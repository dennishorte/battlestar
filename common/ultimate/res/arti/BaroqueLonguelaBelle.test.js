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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Astronomy'],
        green: ['Metric System'],
        museum: ['Museum 1', 'Baroque-Longue la Belle'],
      },
    })
  })
})
