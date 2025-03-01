Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Masquerade', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Masquerade'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Masquerade')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Masquerade'],
      },
    })
  })

})