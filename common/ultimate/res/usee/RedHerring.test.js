Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Red Herring', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Red Herring'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Red Herring')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Red Herring'],
      },
    })
  })

})