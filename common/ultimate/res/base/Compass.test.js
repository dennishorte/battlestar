Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Compass', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Compass'],
        purple: ['Code of Laws'],
        red: ['Archery'],
      },
      micah: {
        blue: ['Tools'],
        green: ['Clothing'],
        yellow: ['Agriculture'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Compass')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Compass'],
        purple: ['Code of Laws'],
        yellow: ['Agriculture'],
      },
      micah: {
        blue: ['Tools'],
        green: ['Clothing'],
        red: ['Archery'],
      },
    })
  })

})
