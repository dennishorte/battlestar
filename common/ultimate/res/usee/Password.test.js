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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Password')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Password'],
      },
    })
  })

})