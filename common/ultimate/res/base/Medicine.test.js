Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Medicine', () => {

  test.only('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Medicine'],
        score: ['The Wheel', 'Construction'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting', 'Reformation'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Medicine')
    request = t.choose(game, request, 'Reformation')
    request = t.choose(game, request, '3')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Medicine'],
        score: ['Reformation', 'Construction'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting', 'The Wheel'],
      }
    })
  })

  test('dogma (no target)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Medicine'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting', 'Reformation'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Medicine')
    request = t.choose(game, request, 'Reformation')
    request = t.choose(game, request, '4')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Medicine'],
        score: ['Reformation'],
      },
      micah: {
        score: ['Enterprise', 'Fermenting'],
      }
    })
  })
})
