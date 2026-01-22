Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Kilogram of the Archives", () => {

  test('dogma: with red card and hand card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Kilogram of the Archives"],
        red: ['Engineering'],
        hand: ['Lighting'],
      },
      decks: {
        base: {
          10: ['Software'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Software'],
        museum: ['Museum 1', 'Kilogram of the Archives'],
      },
    })
  })

  test('dogma: do not sum to 10', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Kilogram of the Archives"],
        red: ['Archery'],
        hand: ['Lighting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Kilogram of the Archives'],
      },
    })
    t.testDeckIsJunked(game, 8)
  })

  test('dogma: with only hand card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Kilogram of the Archives"],
        hand: ['Lighting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Kilogram of the Archives'],
      },
    })
  })

  test('dogma: with only red card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Kilogram of the Archives"],
        red: ['Engineering'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Kilogram of the Archives'],
      },
    })
  })
})
