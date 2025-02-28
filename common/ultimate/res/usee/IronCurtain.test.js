Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Iron Curtain', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Iron Curtain'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Iron Curtain')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Iron Curtain'],
      },
    })
  })

})