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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Classification'],
      },
    })
  })
})
