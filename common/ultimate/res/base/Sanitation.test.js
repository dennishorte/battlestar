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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sanitation')
    request = t.choose(game, 'Services')
    request = t.choose(game, 'Tools')
    request = t.choose(game, 7)

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 7)
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
