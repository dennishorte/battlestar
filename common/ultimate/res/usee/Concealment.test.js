Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Concealment', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Concealment'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Concealment')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Concealment'],
      },
    })
  })

})