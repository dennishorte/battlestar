Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Smuggling', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Smuggling'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Smuggling')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Smuggling'],
      },
    })
  })

})