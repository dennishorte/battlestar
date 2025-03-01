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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Statistics')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
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
