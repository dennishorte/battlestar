Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Hacking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Hacking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hacking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Hacking'],
      },
    })
  })

})