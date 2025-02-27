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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Medicine')
    const request3 = t.choose(game, request2, 'Reformation')
    const request4 = t.choose(game, request2, '3')

    t.testIsSecondPlayer(request4)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Medicine')
    const request3 = t.choose(game, request2, 'Reformation')
    const request4 = t.choose(game, request2, '4')

    t.testIsSecondPlayer(request4)
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
