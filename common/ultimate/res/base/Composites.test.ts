Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Composites', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Composites'],
      },
      micah: {
        hand: ['The Wheel', 'Experimentation', 'Services'],
        score: ['Tools', 'Enterprise'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Composites')
    request = t.choose(game, request, 'The Wheel', 'Experimentation')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Composites'],
        hand: ['The Wheel', 'Experimentation'],
        score: ['Enterprise'],
      },
      micah: {
        hand: ['Services'],
        score: ['Tools'],
      },
    })
  })

})
