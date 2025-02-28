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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Quantum Computers')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Computers'],
      },
    })
  })

})