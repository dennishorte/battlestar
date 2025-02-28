Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Meteorology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Meteorology'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Meteorology')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Meteorology'],
      },
    })
  })

})