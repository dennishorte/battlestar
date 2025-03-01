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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Handshake')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Handshake'],
      },
    })
  })

})