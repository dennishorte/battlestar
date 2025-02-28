Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Assassination', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Assassination'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Assassination')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Assassination'],
      },
    })
  })

})