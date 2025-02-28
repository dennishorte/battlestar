Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('April Fool's Day', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['April Fool's Day'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.April Fool's Day')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['April Fool's Day'],
      },
    })
  })

})