Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Navigation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Navigation'],
      },
      micah: {
        score: ['Calendar', 'Machinery', 'The Wheel', 'Enterprise'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Navigation')

    t.testChoices(request2, ['Calendar', 'Machinery'])

    const request3 = t.choose(game, request2, 'Calendar')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Navigation'],
        score: ['Calendar'],
      },
      micah: {
        score: ['Machinery', 'The Wheel', 'Enterprise'],
      },
    })
  })
})
