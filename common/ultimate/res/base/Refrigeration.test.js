Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Refrigeration', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Refrigeration'],
        hand: ['Tools', 'Computers'],
      },
      micah: {
        hand: ['Canning', 'Experimentation', 'Domestication', 'Sailing', 'The Wheel']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Refrigeration')
    const request3 = t.choose(game, request2, 'Domestication', 'Sailing')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'Computers')

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        yellow: ['Refrigeration'],
        hand: ['Tools'],
        score: ['Computers'],
      },
      micah: {
        hand: ['Canning', 'Experimentation', 'The Wheel']
      },
    })
  })
})
