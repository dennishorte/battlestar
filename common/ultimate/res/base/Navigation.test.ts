Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Navigation')

    t.testChoices(request, ['Calendar', 'Machinery'])

    request = t.choose(game, request, 'Calendar')

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
