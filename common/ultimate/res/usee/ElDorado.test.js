Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('El Dorado', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['El Dorado'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.El Dorado')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['El Dorado'],
      },
    })
  })

})