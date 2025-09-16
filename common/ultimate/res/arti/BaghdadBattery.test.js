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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Jiskairumoko Necklace')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
      },
    })
  })
})
