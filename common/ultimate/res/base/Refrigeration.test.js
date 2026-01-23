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
        hand: ['Canning', 'Experimentation', 'Domestication', 'Sailing']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Refrigeration')
    request = t.choose(game, 'Domestication', 'Sailing', 'Experimentation')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Computers')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Refrigeration'],
        hand: ['Tools'],
        score: ['Computers'],
      },
      micah: {
        hand: ['Canning']
      },
    })
  })
})
