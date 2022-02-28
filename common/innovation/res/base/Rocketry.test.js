Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Rocketry', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        blue: ['Rocketry'],
        purple: ['The Internet'],
      },
      micah: {
        score: ['The Wheel', 'Canning', 'Services']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Rocketry')
    const request3 = t.choose(game, request2, 'Services', 'Canning')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        blue: ['Rocketry'],
        purple: ['The Internet'],
      },
      micah: {
        score: ['The Wheel'],
      }
    })
  })
})
