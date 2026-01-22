Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Compass', () => {

  test('dogma', () => {
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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Compass')

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
