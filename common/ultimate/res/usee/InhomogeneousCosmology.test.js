Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Inhomogeneous Cosmology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Inhomogeneous Cosmology'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Inhomogeneous Cosmology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Inhomogeneous Cosmology'],
      },
    })
  })

})