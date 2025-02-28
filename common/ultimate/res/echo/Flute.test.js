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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Flute')
    const request3 = t.choose(game, request2, 'purple')

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
