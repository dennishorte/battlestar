Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sanitation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        yellow: ['Sanitation'],
        hand: ['Tools', 'The Wheel', 'Canning'],
      },
      micah: {
        hand: ['Software', 'Computers', 'Services']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sanitation')
    const request3 = t.choose(game, request2, 'Services')
    const request4 = t.choose(game, request3, 'Tools')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        yellow: ['Sanitation'],
        hand: ['The Wheel', 'Canning', 'Services', 'Software'],
      },
      micah: {
        hand: ['Computers', 'Tools']
      }
    })
  })
})
