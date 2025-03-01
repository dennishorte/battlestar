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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fermi Paradox')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Fermi Paradox'],
      },
    })
  })

})