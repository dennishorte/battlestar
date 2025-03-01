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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Road Building')
    request = t.choose(game, request, 'Tools', 'Computers')
    request = t.choose(game, request, 'Tools')
    request = t.choose(game, request, 'micah')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Road Building')
    request = t.choose(game, request, 'Computers')

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
