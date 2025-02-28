Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Road Building', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['Road Building'],
        green: ['Sailing'],
        hand: ['Tools', 'Computers'],
      },
      micah: {
        green: ['Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Road Building')
    const request3 = t.choose(game, request2, 'Tools', 'Computers')
    const request4 = t.choose(game, request3, 'Tools')
    const request5 = t.choose(game, request4, 'micah')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Navigation', 'Sailing'],
        blue: ['Computers', 'Tools'],
      },
      micah: {
        red: ['Road Building'],
      },
    })
  })

  test('dogma (meld one)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['Road Building'],
        green: ['Sailing'],
        hand: ['Tools', 'Computers'],
      },
      micah: {
        green: ['Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Road Building')
    const request3 = t.choose(game, request2, 'Computers')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Road Building'],
        green: ['Sailing'],
        blue: ['Computers'],
        hand: ['Tools'],
      },
      micah: {
        green: ['Navigation'],
      },
    })
  })
})
