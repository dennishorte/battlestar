Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret Police', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Secret Police'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Secret Police')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Secret Police'],
      },
    })
  })

})