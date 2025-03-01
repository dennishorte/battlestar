Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Confession', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confession'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Confession')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Confession'],
      },
    })
  })

})