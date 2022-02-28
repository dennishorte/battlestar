Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Composites', () => {

  test('inspire', () => {
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Composites')
    const request3 = t.choose(game, request2, 'The Wheel', 'Experimentation')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
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
