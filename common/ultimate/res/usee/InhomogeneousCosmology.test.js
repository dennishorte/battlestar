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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Inhomogeneous Cosmology')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Inhomogeneous Cosmology'],
      },
    })
  })

})