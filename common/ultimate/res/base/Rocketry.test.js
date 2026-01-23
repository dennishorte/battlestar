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
    request = t.choose(game, 'Dogma.Rocketry')
    request = t.choose(game, '**base-9* (micah)', '**base-6* (micah)')
    request = t.choose(game, 'auto')

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
