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
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Software'],
      },
    })
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
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
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
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
    })
  })
})
