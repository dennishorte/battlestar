Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Probability', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Probability'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Probability')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Probability'],
      },
    })
  })

})