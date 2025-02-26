Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Databases', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Databases'],
      },
      micah: {
        score: ['Tools', 'Enterprise', 'Reformation'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Databases')
    const request3 = t.choose(game, request2, 'Tools', 'Reformation')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        green: ['Databases'],
      },
      micah: {
        score: ['Enterprise'],
      }
    })
  })

})
