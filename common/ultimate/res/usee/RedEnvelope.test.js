Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Red Envelope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Red Envelope'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Red Envelope')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Red Envelope'],
      },
    })
  })

})