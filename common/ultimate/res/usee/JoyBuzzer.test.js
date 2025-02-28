Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Joy Buzzer', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Joy Buzzer'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Joy Buzzer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Joy Buzzer'],
      },
    })
  })

})