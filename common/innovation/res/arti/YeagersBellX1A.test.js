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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Coal')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Composites'],
        blue: ['Computers'],
        green: ['Databases'],
        hand: ['Coal'],
        score: ['Calendar'],
      },
      micah: {
        blue: ['Tools'],
        score: ['Sailing'],
        hand: ['Canning'],
      },
    })
  })
})
