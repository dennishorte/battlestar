Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Flute", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Flute', 'Code of Laws'],
        hand: ['Sailing'],
      },
      micah: {
        hand: ['Plumbing', 'Tools'],
      },
      decks: {
        base: {
          1: ['Mysticism'],
        },
        echo: {
          1: ['Candles'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Flute')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Flute', 'Code of Laws'],
          splay: 'left',
        },
        hand: ['Sailing', 'Candles', 'Mysticism'],
      },
      micah: {
        hand: ['Tools'],
      },
    })
  })
})
