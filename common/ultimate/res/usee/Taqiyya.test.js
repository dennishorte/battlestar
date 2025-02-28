Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Taqiyya', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Taqiyya'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Taqiyya')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Taqiyya'],
      },
    })
  })

})