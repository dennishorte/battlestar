Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Popular Science', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Popular Science'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Popular Science')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Popular Science'],
      },
    })
  })

})