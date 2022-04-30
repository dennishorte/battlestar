Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Statistics', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        yellow: ['Statistics', 'Agriculture'],
      },
      micah: {
        score: ['The Wheel', 'Calendar', 'Construction']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Statistics')
    const request3 = t.choose(game, request2, 'yellow')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Statistics', 'Agriculture'],
          splay: 'right'
        }
      },
      micah: {
        hand: ['Calendar', 'Construction'],
        score: ['The Wheel'],
      },
    })
  })
})
