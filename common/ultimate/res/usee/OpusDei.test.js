Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Opus Dei', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Opus Dei'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Opus Dei')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Opus Dei'],
      },
    })
  })

})