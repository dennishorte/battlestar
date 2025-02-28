Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Password', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Password'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Password')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Password'],
      },
    })
  })

})