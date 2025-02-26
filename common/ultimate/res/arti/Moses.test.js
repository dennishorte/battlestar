Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Moses", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Moses"],
        red: ['The Pirate Code'],
      },
      micah: {
        yellow: ['Agriculture'],
        green: ['Navigation', 'Sailing'],
        purple: ['Code of Laws'],
      },
      decks: {
        base: {
          1: ['Tools']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'The Pirate Code')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        score: ['Navigation', 'Code of Laws', 'Sailing'],
        hand: ['Tools'],
      },
      micah: {
        yellow: ['Agriculture'],
        score: ['The Pirate Code'],
      }
    })
  })
})
