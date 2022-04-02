Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Philips Compact Cassette", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Philips Compact Cassette"],
        red: ['Combustion', 'Engineering'],
        purple: ['Socialism', 'Code of Laws'],
        blue: ['Atomic Theory', 'Computers'],
      },
      micah: {
        red: {
          cards: ['Flight', 'Archery'],
          splay: 'left',
        },
        yellow: {
          cards: ['Canning', 'Agriculture'],
          splay: 'up',
        },
        green: ['Navigation', 'Paper'],
        blue: ['Pottery'],
      },
      decks: {
        base: {
          8: ['Quantum Theory'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'red', 'green')
    const request4 = t.choose(game, request3, 'red', 'blue')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Combustion', 'Engineering'],
          splay: 'up'
        },
        purple: ['Socialism', 'Code of Laws'],
        blue: {
          cards: ['Atomic Theory', 'Computers'],
          splay: 'up'
        },
        hand: ['Quantum Theory'],
      },
      micah: {
        red: {
          cards: ['Flight', 'Archery'],
          splay: 'up'
        },
        yellow: ['Canning', 'Agriculture'],
        green: {
          cards: ['Navigation', 'Paper'],
          splay: 'up'
        },
        blue: ['Pottery'],
      },
    })
  })
})
