Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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
    request = t.choose(game, 'Dogma.Composites')
    request = t.choose(game, 'The Wheel', 'Experimentation')
    request = t.choose(game, 'auto')

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
