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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Probability')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Probability'],
      },
    })
  })

})