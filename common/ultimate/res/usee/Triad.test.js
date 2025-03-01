Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Triad', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Triad'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Triad')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Triad'],
      },
    })
  })

})