Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Gallery', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Gallery'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Gallery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Gallery'],
      },
    })
  })

})