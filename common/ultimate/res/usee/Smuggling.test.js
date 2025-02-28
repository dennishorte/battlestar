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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Smuggling')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Smuggling'],
      },
    })
  })

})