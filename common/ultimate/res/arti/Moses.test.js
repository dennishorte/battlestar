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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'The Pirate Code')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Navigation', 'Code of Laws', 'Sailing'],
        hand: ['Tools'],
        museum: ['Museum 1', 'Moses'],
      },
      micah: {
        yellow: ['Agriculture'],
        score: ['The Pirate Code'],
      }
    })
  })
})
