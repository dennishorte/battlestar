Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
        museum: ['Museum 1', 'Sandham Room Cricket Bat'],
      },
    })
  })

  test('dogma: not red', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Sandham Room Cricket Bat"],
      },
      achievements: ['Measurement', 'Industrialization', 'Lighting'],
      decks: {
        base: {
          6: ['Classification'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, '**base-6*')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Classification'],
        museum: ['Museum 1', 'Sandham Room Cricket Bat'],
      },
      junk: ['Industrialization'],
    })
  })
})
