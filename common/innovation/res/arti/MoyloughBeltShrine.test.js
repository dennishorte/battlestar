Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Moylough Belt Shrine", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Moylough Belt Shrine"],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Code of Laws', 'Tools'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Code of Laws')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Code of Laws']
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Tools'],
      }
    })
  })

  test('dogma: no cards in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Moylough Belt Shrine"],
      },
      micah: {
        green: ['The Wheel'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      micah: {
        green: ['The Wheel'],
      }
    })
  })
})
