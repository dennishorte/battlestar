Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Submarine H. L. Hunley", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Submarine H. L. Hunley"],
      },
      micah: {
        red: ['Coal'],
        purple: ['Code of Laws'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      micah: {
        red: ['Coal'],
      }
    })
  })

  test('dogma: bottom card is not 1', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Submarine H. L. Hunley"],
      },
      micah: {
        red: ['Coal'],
        purple: ['Enterprise'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      micah: {
        red: ['Coal'],
        purple: ['Lighting', 'Enterprise'],
      }
    })
  })
})
