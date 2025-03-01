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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Near-Field Comm')
    request = t.choose(game, request, 6)

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
