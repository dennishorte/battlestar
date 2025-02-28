Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Shangri-La', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shangri-La'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Shangri-La')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shangri-La'],
      },
    })
  })

})