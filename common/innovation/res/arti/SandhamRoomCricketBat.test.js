Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sandham Room Cricket Bat", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Sandham Room Cricket Bat"],
      },
      achievements: ['Software'],
      decks: {
        base: {
          6: ['Industrialization'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Industrialization'],
        achievements: ['Software'],
      },
    })
  })

  test('dogma: not red', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Sandham Room Cricket Bat"],
      },
      decks: {
        base: {
          6: ['Classification'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Classification'],
      },
    })
  })
})
