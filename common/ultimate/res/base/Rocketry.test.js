Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Rocketry', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        blue: ['Rocketry'],
        purple: ['The Internet'],
        yellow: ['Agriculture'],
      },
      micah: {
        score: ['The Wheel', 'Canning', 'Services']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Rocketry')
    request = t.choose(game, request, 'Services', 'Canning')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Rocketry'],
        purple: ['The Internet'],
        yellow: ['Agriculture'],
      },
      micah: {
        score: ['The Wheel'],
      }
    })
  })
})
