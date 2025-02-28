Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Handshake', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Handshake'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Handshake')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Handshake'],
      },
    })
  })

})