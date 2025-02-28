Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Rumor', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Rumor'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Rumor')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Rumor'],
      },
    })
  })

})