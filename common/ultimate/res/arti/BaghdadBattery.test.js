Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Baghdad Battery', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Baghdad Battery'],
        hand: ['Paper', 'Jiskairumoko Necklace'],
      },
      decks: {
        base: {
          2: ['Construction', 'Calendar', 'Fermenting', 'Monotheism', 'Mathematics']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Jiskairumoko Necklace')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Paper', 'Jiskairumoko Necklace'],
        score: ['Construction', 'Calendar', 'Fermenting', 'Monotheism', 'Mathematics'],
      },
    })
  })

  test('dogma: non-matching', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Baghdad Battery'],
        hand: ['Paper', 'Construction'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        red: ['Construction'],
      },
    })
  })

  test('dogma: only one', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Baghdad Battery'],
        hand: ['Paper'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
      },
    })
  })
})
