Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret Santa', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Secret Santa'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Secret Santa')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Secret Santa'],
      },
    })
  })

})