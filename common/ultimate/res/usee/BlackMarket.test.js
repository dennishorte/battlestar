Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Black Market', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Black Market'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Black Market')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Black Market'],
      },
    })
  })

})