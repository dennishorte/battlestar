Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Palmistry', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Palmistry'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Palmistry')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Palmistry'],
      },
    })
  })

})