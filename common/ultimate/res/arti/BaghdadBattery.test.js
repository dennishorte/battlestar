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
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Paper')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        score: ['Jiskairumoko Necklace'],
        museum: ['Museum 1', 'Baghdad Battery'],
      },
    })

    expect(game.zones.byId('junk').cardlist().length > 0).toBe(true)
  })

  test('dogma: same age', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Baghdad Battery'],
        hand: ['Paper', 'Machinery'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Paper')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        score: ['Machinery'],
        museum: ['Museum 1', 'Baghdad Battery'],
      },
      junk: [],
    })
  })
})
