Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cryptocurrency', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cryptocurrency'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cryptocurrency')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cryptocurrency'],
      },
    })
  })

})