Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Freemasons', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Freemasons')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
      },
    })
  })

})