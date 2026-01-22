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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Combustion')
    request = t.choose(game, 'Tools')

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
