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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
    })
  })
})
