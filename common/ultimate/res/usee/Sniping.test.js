Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Sniping', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sniping'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sniping')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Sniping'],
      },
    })
  })

})