Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Mafia', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Mafia'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mafia')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Mafia'],
      },
    })
  })

})