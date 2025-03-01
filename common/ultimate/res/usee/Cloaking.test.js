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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cloaking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Cloaking'],
      },
    })
  })

})