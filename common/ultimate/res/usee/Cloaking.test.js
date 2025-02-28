Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cloaking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Cloaking'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Cloaking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Cloaking'],
      },
    })
  })

})