Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Coal')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Composites'],
        blue: ['Computers'],
        green: ['Databases'],
        hand: ['Coal'],
        score: ['Calendar'],
        museum: ['Museum 1', "Yeager's Bell X-1A"],
      },
      micah: {
        blue: ['Tools'],
        score: ['Sailing'],
        hand: ['Canning'],
      },
    })
  })
})
