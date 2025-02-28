Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Buried Treasure', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Buried Treasure')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Buried Treasure'],
      },
    })
  })

})