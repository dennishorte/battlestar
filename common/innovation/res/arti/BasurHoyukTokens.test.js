Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Basur Hoyuk Tokens', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Basur Hoyuk Tokens'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          4: ['Reformation']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Reformation'],
        score: ['Sailing'],
      },
    })
  })

  test('dogma: return everything', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Basur Hoyuk Tokens'],
        purple: ['Monotheism', 'Code of Laws'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          4: ['Reformation']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Monotheism', 'Code of Laws'],
      },
    })
  })
})
