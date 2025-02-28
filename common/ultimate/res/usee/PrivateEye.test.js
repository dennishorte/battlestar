Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Private Eye', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Private Eye'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Private Eye')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Private Eye'],
      },
    })
  })

})