Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Myth', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Myth'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Myth')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Myth'],
      },
    })
  })

})