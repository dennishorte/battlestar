Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Near-Field Comm', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Near-Field Comm'],
        score: ['The Wheel'],
      },
      micah: {
        score: ['Reformation', 'Machine Tools'],
      },
      decks: {
        base: {
          6: ['Atomic Theory'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Near-Field Comm')
    const request3 = t.choose(game, request2, 6)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Near-Field Comm'],
        score: ['The Wheel', 'Machine Tools', 'Atomic Theory'],
      },
      micah: {
        score: ['Reformation'],
      },
    })
  })

})
