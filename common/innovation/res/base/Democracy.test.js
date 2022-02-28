Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Democracy', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Democracy'],
        hand: ['The Wheel'],
      },
      micah: {
        blue: ['Tools'],
        hand: ['Coal'],
      },
      decks: {
        base: {
          6: ['Canning'],
          8: ['Flight'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Democracy')
    const request3 = t.choose(game, request2, 'Coal')
    const request4 = t.choose(game, request3, 'The Wheel')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Democracy'],
        hand: ['Canning'],
      },
      micah: {
        blue: ['Tools'],
        score: ['Flight'],
      }
    })
  })

})
