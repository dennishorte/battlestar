Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Legend', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Legend'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Legend')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Legend'],
      },
    })
  })

})