Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Whatchamacallit', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Whatchamacallit'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Whatchamacallit')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Whatchamacallit'],
      },
    })
  })

})