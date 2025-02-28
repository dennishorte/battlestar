Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Teleprompter', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Teleprompter'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Teleprompter')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Teleprompter'],
      },
    })
  })

})