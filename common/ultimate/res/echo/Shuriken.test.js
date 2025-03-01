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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Shuriken')
    request = t.choose(game, request, 'purple')

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
