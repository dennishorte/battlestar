Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Dark Web', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Dark Web'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dark Web')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Dark Web'],
      },
    })
  })

})