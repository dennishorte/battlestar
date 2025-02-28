Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Shuriken", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Shuriken'],
        purple: ['Code of Laws', 'Mysticism'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
        blue: ['Mathematics'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Shuriken')
    const request3 = t.choose(game, request2, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Shuriken'],
        purple: {
          cards: ['Code of Laws', 'Mysticism'],
          splay: 'right'
        },
        blue: ['Mathematics'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Agriculture'],
        hand: ['Enterprise'],
      },
    })
  })
})
