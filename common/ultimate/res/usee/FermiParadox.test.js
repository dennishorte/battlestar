Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Fermi Paradox', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Fermi Paradox'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fermi Paradox')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Fermi Paradox'],
      },
    })
  })

})