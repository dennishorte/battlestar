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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Opus Dei')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Opus Dei'],
      },
    })
  })

})