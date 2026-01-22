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
        echo: {
          1: ['Candles', 'Puppet'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Flute')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Flute', 'Code of Laws'],
          splay: 'left',
        },
        hand: ['Sailing', 'Candles', 'Puppet'],
      },
      micah: {
        hand: ['Tools'],
      },
    })
  })
})
