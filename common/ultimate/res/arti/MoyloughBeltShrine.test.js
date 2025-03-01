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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Code of Laws')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      micah: {
        green: ['The Wheel'],
      }
    })
  })
})
