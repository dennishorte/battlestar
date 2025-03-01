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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      micah: {
        red: ['Coal'],
        purple: ['Lighting', 'Enterprise'],
      }
    })
  })
})
