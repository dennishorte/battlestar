Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Handbag', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Handbag'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Handbag')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Handbag'],
      },
    })
  })

})