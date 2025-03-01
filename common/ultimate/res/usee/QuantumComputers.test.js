Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Quantum Computers', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Quantum Computers'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Quantum Computers')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Computers'],
      },
    })
  })

})