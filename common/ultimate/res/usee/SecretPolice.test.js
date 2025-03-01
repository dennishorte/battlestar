Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret Police', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Secret Police'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secret Police')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Secret Police'],
      },
    })
  })

})