Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Yeager's Bell X-1A", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Yeager's Bell X-1A"],
      },
      micah: {
        blue: ['Tools'],
        score: ['Calendar', 'Sailing'],
        hand: ['Canning', 'Coal'],
      },
      decks: {
        base: {
          9: ['Computers', 'Composites',],
          10: ['Databases'],
          11: ['Hypersonics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Composites'],
        blue: ['Computers'],
        green: ['Databases'],
        museum: ['Museum 1', "Yeager's Bell X-1A"],
        achievements: ['Hypersonics'],
      },
      micah: {
        blue: ['Tools'],
        score: ['Sailing', 'Calendar'],
        hand: ['Canning', 'Coal'],
      },
    })
  })
})
