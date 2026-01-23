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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Reformation'],
        score: ['Sailing'],
        museum: ['Museum 1', 'Basur Hoyuk Tokens'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Monotheism', 'Code of Laws'],
        museum: ['Museum 1', 'Basur Hoyuk Tokens'],
      },
    })
  })
})
