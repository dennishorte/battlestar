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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Joy Buzzer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Joy Buzzer'],
      },
    })
  })

})