Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('3D Printing', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['3D Printing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.3D Printing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['3D Printing'],
      },
    })
  })

})