Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Jackalope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Jackalope'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Jackalope')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Jackalope'],
      },
    })
  })

})