Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Combustion', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Combustion', 'Metalworking'],
      },
      micah: {
        score: ['Tools', 'Calendar', 'Machinery', 'Translation']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Combustion')
    const request3 = t.choose(game, request2, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Combustion'],
        score: ['Tools'],
      },
      micah: {
        score: ['Calendar', 'Machinery', 'Translation']
      },
    })
  })
})
