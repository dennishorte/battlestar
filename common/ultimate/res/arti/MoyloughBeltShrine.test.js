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
        purple: ['Code of Laws'],
        museum: ['Museum 1', 'Moylough Belt Shrine'],
      },
      micah: {
        green: ['The Wheel'],
        hand: ['Tools'],
      }
    })

    expect(game.cards.byZone('junk').length).toBeGreaterThan(4)
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
      dennis: {
        museum: ['Museum 1', 'Moylough Belt Shrine'],
      },
      micah: {
        green: ['The Wheel'],
      },
      junk: [],
    })
  })
})
