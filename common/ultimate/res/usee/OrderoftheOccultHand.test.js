Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Order of the Occult Hand', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Order of the Occult Hand')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Order of the Occult Hand'],
      },
    })
  })

})