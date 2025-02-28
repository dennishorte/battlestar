Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Consulting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Consulting'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Consulting')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Consulting'],
      },
    })
  })

})