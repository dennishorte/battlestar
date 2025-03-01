Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Symbology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Symbology'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Symbology')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Symbology'],
      },
    })
  })

})